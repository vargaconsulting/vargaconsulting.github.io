document$.subscribe(() => {
  document.querySelectorAll("details.example").forEach((details_el) => {
    details_el.open = false;
  });
});