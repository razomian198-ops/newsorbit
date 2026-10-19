    // Searches the headlines collected by tools/fetch_news.py (data/news-data.js).
    (function () {
      var params = new URLSearchParams(window.location.search);
      var query = (params.get("q") || "").trim();
      var summary = document.getElementById("search-summary");
      var results = document.getElementById("results");
      var box = document.querySelector(".search input");
      if (box) { box.value = query; }

      var data = window.NEWS_DATA;
      if (!data || !data.items) {
        summary.textContent = "No collected headlines were found. Run tools/fetch_news.py first.";
        return;
      }
      if (query === "") {
        summary.textContent = "Type a word in the search box above and press Search. " +
          "Searching " + data.items.length + " collected headlines.";
        return;
      }

      function labelSpan(key, fallback) {
        var s = document.createElement("span");
        s.setAttribute("data-i18n", key);
        s.textContent = fallback;
        return s;
      }
      function addRelated(parent, item) {
        if (!item.related || item.related.length === 0) { return; }
        var line = document.createElement("div");
        line.className = "meta";
        line.appendChild(labelSpan("also_reported", "Also reported by"));
        line.appendChild(document.createTextNode(": "));
        var shown = 0;
        item.related.forEach(function (r) {
          if (!/^https?:\/\//i.test(r.link || "")) { return; }
          if (shown > 0) { line.appendChild(document.createTextNode(", ")); }
          var a = document.createElement("a");
          a.href = r.link; a.target = "_blank"; a.rel = "noopener noreferrer";
          a.style.textDecoration = "underline";
          a.textContent = r.source;
          line.appendChild(a);
          shown++;
        });
        if (shown > 0) { parent.appendChild(line); }
      }
      var words = query.toLowerCase().split(/\s+/);
      var found = data.items.filter(function (item) {
        var text = (item.title + " " + item.note + " " + item.source).toLowerCase();
        return words.every(function (w) { return text.indexOf(w) !== -1; });
      });

      if (data.is_sample_data) {
        summary.textContent = "SAMPLE DATA: results below come from fake test items, not real news. ";
      } else {
        summary.textContent = "";
      }
      summary.textContent += found.length + " result(s) for \u201c" + query + "\u201d, searched in " +
        data.items.length + " headlines collected on " + data.collected_at + ".";

      found.forEach(function (item) {
        var box = document.createElement("article");
        box.className = "story";

        var h2 = document.createElement("h2");
        var a = document.createElement("a");
        if (/^https?:\/\//i.test(item.link || "")) { a.href = item.link; } a.target = "_blank"; a.rel = "noopener noreferrer";
        a.textContent = item.title;
        h2.appendChild(a);

        var p = document.createElement("p");
        p.textContent = item.note;

        var meta = document.createElement("div");
        meta.className = "meta";
        meta.appendChild(labelSpan("source_label", "Source"));
        meta.appendChild(document.createTextNode(": " + item.source + " \u00b7 "));
        meta.appendChild(labelSpan("published", "Published"));
        meta.appendChild(document.createTextNode(": " + item.published + " \u00b7 "));
        meta.appendChild(labelSpan("original_language", "Original language"));
        meta.appendChild(document.createTextNode(": "));
        var langName = document.createElement("span");
        langName.setAttribute("data-lang-name", item.language || "");
        langName.textContent = item.language || "not stated by the source";
        meta.appendChild(langName);
        meta.appendChild(document.createTextNode(" \u00b7 "));
        meta.appendChild(labelSpan("opens_original", "Opens the original report"));

        box.appendChild(h2); box.appendChild(p); box.appendChild(meta);
        addRelated(box, item);
        results.appendChild(box);
      });
    })();
  
