(function () {
  "use strict";
  var g = window.gsap, ST = window.ScrollTrigger;
  var pista = document.getElementById("proc-pista"), barra = document.getElementById("proc-barra");
  if (!g || !ST || !pista || window.CP.reduce) return;
  g.registerPlugin(ST);
  var mm = g.matchMedia();
  mm.add("(min-width: 901px)", function () {
    var dist = function () { return pista.scrollWidth - innerWidth + 80; };
    var tw = g.to(pista, { x: function () { return -dist(); }, ease: "none",
      scrollTrigger: { trigger: ".proceso", pin: ".proceso-pin", start: "top top", end: function () { return "+=" + dist(); }, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: function (s) { barra.style.transform = "scaleX(" + s.progress + ")"; } } });
    g.utils.toArray(".paso img").forEach(function (im) {
      g.fromTo(im, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: im.parentNode, containerAnimation: tw, start: "left right", end: "center center", scrub: true } });
    });
    return function () { g.set(pista, { clearProps: "transform" }); };
  });
})();
