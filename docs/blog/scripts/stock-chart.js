<script type="module">
    function ema(xs, n = 12) {
        if (!xs.length) return [];
        const k = 2 / (n + 1);
        let e = xs[0].value;
        const out = [];
        for (const p of xs) {
            e = k * p.value + (1 - k) * e;
            out.push({ time: p.time, value: e });
        }
        return out;
    }

    const SYMBOLS = ["aapl","tsla","amd","qqq","spy","nvda","plug","intc","hyg","lqd","iwm","mu","aal","csco","xlf","xle","xlp"];

    // --- theme helpers ------------------------------------------------------------
    function md_var(name){
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
    function material_theme() {
        return {
            bg:      md_var('--md-default-bg-color'),
            fg:      md_var('--md-default-fg-color'),
            faint:   md_var('--md-default-fg-color--light'),
            faint2:  md_var('--md-default-fg-color--lighter'),
            primary: md_var('--md-primary-fg-color'),
            accent:  md_var('--md-accent-fg-color'),
        };
    }

// --- chart registry (one chart per div) --------------------------------------
const registry = new Map();  // div_id -> {chart, price, volume, ro, mo, animTimer, token, current}

function get_or_create_chart(div_id){
    let st = registry.get(div_id);
    if (st) return st;

    const el = document.getElementById(div_id);
    const t = material_theme();

    const chart = LightweightCharts.createChart(el, {
        width:  el.clientWidth,
        height: el.clientHeight,
        layout: { background: { color: t.bg }, textColor: t.fg },
        grid:   { vertLines: { color: t.faint }, horzLines: { color: t.faint } },
        rightPriceScale: { borderColor: t.faint },
        timeScale: { borderColor: t.faint },
        crosshair: {
            vertLine: { color: t.faint2, labelBackgroundColor: t.primary },
            horzLine: { color: t.faint2, labelBackgroundColor: t.primary },
        },
    });
    chart.timeScale().applyOptions({ visible: true });
    const price = chart.addLineSeries({ color: t.primary, lineWidth: 2 });

    // dedicated hidden bottom scale for volume
    const VOLUME_SCALE_ID = 'volume';
    chart.priceScale(VOLUME_SCALE_ID).applyOptions({
        visible: true,
        scaleMargins: { top: 0.80, bottom: 0.02 },
        borderColor: t.faint,
    });
    const volume = chart.addHistogramSeries({
        priceScaleId: VOLUME_SCALE_ID,
        priceFormat: { type: 'volume' },
        color: t.faint2,
    });

    // responsive
    const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        chart.resize(Math.floor(width), Math.floor(height));
    };
    
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    window.addEventListener('resize', resize);

    // retheme on Material toggles
    const retheme = () => {
        const tt = material_theme();
        chart.applyOptions({
            layout: { background: { color: tt.bg }, textColor: tt.fg },
            grid:   { vertLines: { color: tt.faint }, horzLines: { color: tt.faint } },
            rightPriceScale: { borderColor: tt.faint },
            timeScale: {visible:true, borderColor: tt.faint },
            crosshair: {
                vertLine: { color: tt.faint2, labelBackgroundColor: tt.primary },
                horzLine: { color: tt.faint2, labelBackgroundColor: tt.primary },
            },
        });
        chart.priceScale(VOLUME_SCALE_ID).applyOptions({ borderColor: tt.faint });
        chart.timeScale().applyOptions({ visible: true, borderColor: t.faint });

        price.applyOptions({ color: tt.primary });
        volume.applyOptions({ color: tt.accent });

    };
    const mo = new MutationObserver(retheme);
        mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-md-color-scheme','data-md-color-primary','data-md-color-accent'],
    });

    st = { chart, price, volume, ro, mo, animTimer: null, token: 0, current: null };
    registry.set(div_id, st);
    return st;
}

// --- load a symbol into an existing chart ------------------------------------
async function load_symbol(symbol, div_id){
    const st = get_or_create_chart(div_id);
    st.current = symbol;
    const my_token = ++st.token;          // cancel older, slower fetches (race guard)

    // stop prior animation if any
    if (st.animTimer) { clearInterval(st.animTimer); st.animTimer = null; }

    // fetch data
    const data = await fetch(`/blog/data/${symbol}.json`).then(r => r.json()).catch(() => null);
    if (!data || my_token !== st.token) return;   // aborted or superseded

    const price_data = data.map(d => ({ time: d.time, value: d.close ?? d.value }));
    const price_smooth = ema(price_data, 3);

    st.price.setData(price_smooth);
    st.volume.setData(data.map(d => ({ time: d.time, value: Math.round(d.volume) })));

    // show last 20% initially
    const n = price_data.length;
    const from_idx = Math.max(0, Math.floor(0.9 * n));
   // st.chart.timeScale().setVisibleRange({ from: price_data[from_idx].time, to: price_data.at(-1).time });

    // simple pan animation (cancelled on next load)
    let idx = 0, W = 300;
    st.animTimer = setInterval(() => {
        if (idx + W >= price_data.length) { clearInterval(st.animTimer); st.animTimer = null; return; }
        st.chart.timeScale().setVisibleRange({ from: price_data[idx].time, to: price_data[idx+W].time });
        idx += 1;
        }, 700);
        /*
        */
}

// --- carousel UI --------------------------------------------------------------
function init_symbol_carousel(container_id, chart_id) {
    const wrap = document.getElementById(container_id);
    wrap.innerHTML = '';
    const make_btn = (sym) => {
        const b = document.createElement('button');
        b.textContent = sym.toUpperCase();
        b.dataset.symbol = sym;
        b.className = "symbol-pill";            // <— new class
        b.addEventListener('click', () => {
            mark_active(wrap, sym);
            b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); // center pill
            load_symbol(sym, chart_id);
        });
        return b;
    };
    SYMBOLS.forEach(s => wrap.appendChild(make_btn(s)));
    mark_active(wrap, SYMBOLS[0]);
}

function mark_active(container, symbol){
    container.querySelectorAll('button').forEach(btn => {
        btn.dataset.active = (btn.dataset.symbol === symbol) ? "true" : "false";
    });
}

// --- boot --------------------------------------------------------------------
// --- boot (after MkDocs Material has typeset the page) -----------------------
function boot() {
  init_symbol_carousel('symbol-carousel', 'stock-data-chart');
  load_symbol('aapl', 'stock-data-chart');
}

const run_after_typeset = () => setTimeout(boot, 0);

if (window.document$ && typeof document$.subscribe === 'function') {
  // initial load + every in-page navigation
  document$.subscribe(run_after_typeset);
} else if (document.readyState !== 'loading') {
  run_after_typeset();
} else {
  document.addEventListener('DOMContentLoaded', run_after_typeset, { once: true });
}

</script>
