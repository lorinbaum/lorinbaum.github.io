
article = document.querySelector("article");
const columnGap = 20;
const columnMinWidth = 510;
function wheelie(event) {
    // console.log(event.target);
    if (event.target.matches("table *, .codehilite *")) { console.log(event.target); return; }
    event.preventDefault();
    const containerWidth = article.getBoundingClientRect().width;
    const columnCount = Math.floor((containerWidth + columnGap) / (columnMinWidth + columnGap));
    const scrollWidth = (containerWidth + columnGap) / columnCount
    const direction = event.deltaY > 0 ? 1 : -1;
    const scrollLeft = article.scrollLeft + scrollWidth * direction;
    article.scrollLeft = Math.round(scrollLeft / scrollWidth) * scrollWidth;
}
if (window.innerWidth >= 1080) { article.addEventListener("wheel", wheelie, { passive: false }); }
else { article.removeEventListener("wheel", wheelie); }
window.addEventListener("resize", () => {
    if (window.innerWidth >= 1080) { article.addEventListener("wheel", wheelie, { passive: false }); }
    else { article.removeEventListener("wheel", wheelie); }
});