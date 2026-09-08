/* Shared composition for the live hero and its three comparison thumbnails. */
(() => {
  function LiebinHero({ direction = "close", mini = false, showPortrait = true, onSelect }) {
    const h = React.createElement;
    const frame = React.useRef(null);
    const motion = React.useRef(null);
    const miniView = mini === true || mini === "true";

    function resetPortrait() {
      const target = frame.current;
      if (!target) return;
      target.style.setProperty("--tilt-x", "0deg");
      target.style.setProperty("--tilt-y", "0deg");
      target.style.setProperty("--glare-opacity", "0");
    }

    React.useEffect(() => {
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      motion.current = preference;
      preference.addEventListener("change", resetPortrait);
      return () => preference.removeEventListener("change", resetPortrait);
    }, []);

    React.useEffect(resetPortrait, [direction]);

    function movePortrait(event) {
      if (miniView || event.pointerType === "touch" || motion.current?.matches) return;
      const target = frame.current;
      if (!target) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      target.style.setProperty("--tilt-x", `${-y * 5}deg`);
      target.style.setProperty("--tilt-y", `${x * 7}deg`);
      target.style.setProperty("--light-x", `${(x + 1) * 50}%`);
      target.style.setProperty("--light-y", `${(y + 1) * 50}%`);
      target.style.setProperty("--glare-opacity", ".34");
    }

    return h("div", {
      className: `lb-stage${miniView ? " lb-stage--mini" : ""}`,
      "data-direction": direction,
      "aria-hidden": miniView ? "true" : undefined
    }, h("div", {
      className: "lb-study",
      onPointerMove: miniView ? undefined : movePortrait,
      onPointerLeave: miniView ? undefined : resetPortrait
    },
      h("span", { className: "lb-poster-word", "aria-hidden": "true" }, "STEAL."),
      h("div", { className: "lb-copy" },
        h("span", { className: "lb-eyebrow" }, h("span", { className: "lb-live-dot", "aria-hidden": "true" }), "列宾 Skill · 设计方向确认"),
        h(miniView ? "div" : "h1", { className: "lb-title" },
          h("span", null, "让大师帮你"),
          h("span", null, h("em", null, "「偷」"), "设计")
        ),
        h("div", { className: "lb-quote-block" },
          h("p", { className: "lb-quote" }, "优秀的艺术家模仿，伟大的艺术家偷窃。"),
          h("p", { className: "lb-quote-latin" }, "Good artists copy, great artists steal — Steve Jobs")
        ),
        h("p", { className: "lb-description" }, "粘贴你想“", h("span", { className: "lb-inline-steal" }, "偷"), "”的网址或图片，列宾用独特的方式帮你确认+重写Design.md，把你的agent变成懂你的设计师"),
        h(miniView ? "span" : "a", { className: "lb-cta", href: miniView ? undefined : "#how" }, "立即使用", h("span", { "aria-hidden": "true" }, "→")),
        !miniView && h("div", { className: "lb-switcher", role: "group", "aria-label": "切换首屏设计方向" },
          [["close", "贴着做"], ["spirit", "取其神"], ["reverse", "反着来"]].map(([value, label]) =>
            h("button", {
              key: value, className: "hero-choice", type: "button",
              "aria-pressed": direction === value, "aria-controls": "hero-stage",
              onClick: () => onSelect?.(value)
            }, label)
          )
        )
      ),
      direction === "spirit" && h("div", { className: "lb-output", "aria-label": miniView ? undefined : "DESIGN.md 内容结构示意" },
        h("div", { className: "lb-output-heading" }, h("span", null, "设计方向，落到纸上"), h("span", null, "产出示意")),
        h("div", { className: "lb-document" },
          h("div", { className: "lb-document-name" }, "DESIGN.md", h("span", null, "列宾 · 设计依据")),
          h("div", { className: "lb-document-row" }, h("span", null, "01"), h("div", null, h("strong", null, "设计方向"), h("p", null, "选中的表达，与它适合的使用场景。"))),
          h("div", { className: "lb-document-row" }, h("span", null, "02"), h("div", null, h("strong", null, "视觉规则"), h("p", null, "颜色、字体、布局、组件。"), h("div", { className: "lb-swatches", "aria-label": "原站暖纸、墨色和酒红" }, h("span", null), h("span", null), h("span", null)))),
          h("div", { className: "lb-document-row" }, h("span", null, "03"), h("div", null, h("strong", null, "你的取舍"), h("p", null, "喜欢什么，哪里不要，保留你的原话。"))),
          h("div", { className: "lb-document-end" }, "让执行 Agent 沿着你确认的方向继续。")
        )
      ),
      showPortrait && h("figure", { className: "lb-portrait" },
        h("div", { className: "lb-portrait-frame", ref: frame },
          h("img", {
            src: "assets/repin-self-portrait.jpg", alt: miniView ? "" : "伊利亚·列宾自画像，1878",
            width: 789, height: 1000, draggable: false,
            loading: miniView ? "lazy" : "eager", fetchPriority: miniView ? "auto" : "high"
          }),
          h("span", { className: "lb-portrait-border", "aria-hidden": "true" }),
          h("span", { className: "lb-glare", "aria-hidden": "true" })
        ),
        h("figcaption", null, h("i", null, "Ilya Repin, "), h("span", { className: "lb-art-title" }, "列宾自画像"), " 1878 · Tretyakov Gallery — public domain, via Wikimedia Commons")
      )
    ));
  }

  window.LiebinHero = LiebinHero;
})();
