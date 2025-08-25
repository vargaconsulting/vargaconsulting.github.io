import os
import frontmatter
import jinja2
import json
import yaml
from dateutil import parser
from datetime import datetime, timezone


def load_mkdocs_config(path="mkdocs.yml"):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.load(f, Loader=yaml.Loader)

# Config
BLOG_DIR = "docs/blog/posts"
XML_OUTPUT = "site/rss.xml"
JSON_OUTPUT = "site/feed.json"
MAX_ITEMS = 20

# Template
RSS_TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>{{ title }}</title>
    <link>{{ link }}</link>
    <atom:link href="{{ feed_url }}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
    <description>{{ description }}</description>
    <language>en-us</language>
    <lastBuildDate>{{ build_date }}</lastBuildDate>

    {% for post in posts %}
    <item>
      <title>{{ post.title }}</title>
      <link>{{ post.url }}</link>
      <guid isPermaLink="true">{{ post.url }}</guid>
      <pubDate>{{ post.pub_date }}</pubDate>
      <description>{{ post.summary }}</description>
    </item>
    {% endfor %}
  </channel>
</rss>
"""

def rfc2822(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")

def get_posts(site_url):
    posts = []
    for fname in os.listdir(BLOG_DIR):
        if not fname.endswith(".md"):
            continue
        post_path = os.path.join(BLOG_DIR, fname)
        post = frontmatter.load(post_path)

        title = post.get("title", "Untitled")
        raw_date = post.get("date", "1970-01-01")
        date = raw_date if isinstance(raw_date, datetime) else parser.parse(str(raw_date))
        slug = post.get("slug", fname.replace(".md", ""))
        summary = post.get("summary", "No summary provided").strip().split('\n')[0]
        url = f"{site_url}/blog/{slug}/"

        posts.append({
            "title": title,
            "url": url,
            "summary": summary,
            "pub_date": rfc2822(date),
            "date": date
        })

    # Sort newest → oldest
    return sorted(posts, key=lambda p: p["date"], reverse=True)[:MAX_ITEMS]

def write_json_feed(posts, site_name, site_url, site_description):
    feed = {
        "version": "https://jsonfeed.org/version/1.1",
        "title": site_name,
        "home_page_url": f"{site_url}/blog/",
        "feed_url": f"{site_url}/feed.json",
        "description": site_description,
        "items": []
    }

    for p in posts:
        feed["items"].append({
            "id": p["url"],
            "url": p["url"],
            "title": p["title"],
            "summary": p["summary"],
            "date_published": p["date"].isoformat()
        })

    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(feed, f, indent=2)
        print("✅ JSON Feed written to site/feed.json")

def main():
    cfg = load_mkdocs_config()
    site_name = cfg.get("site_name", "Untitled Site")
    site_url = cfg.get("site_url", "http://localhost:8000")
    site_description = cfg.get("site_description", "")
    docs_dir = cfg.get("docs_dir", "")

    env = jinja2.Environment()
    template = env.from_string(RSS_TEMPLATE)
    posts = get_posts(site_url)

    rendered = template.render(
        title=site_name,
        link=f"{site_url}/blog/",
        feed_url=f"{site_url}/rss.xml",
        description=site_description,
        build_date=rfc2822(datetime.now()),
        posts=posts
    )

    os.makedirs(os.path.dirname(XML_OUTPUT), exist_ok=True)

    with open(XML_OUTPUT, "w", encoding="utf-8") as f:
        f.write(rendered)

    write_json_feed(posts, site_name, site_url, site_description)  # ✅ this now works
    print(f"✅ RSS feed written to {XML_OUTPUT}")


if __name__ == "__main__":
    main()

