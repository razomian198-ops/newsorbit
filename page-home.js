    // Fills the "Latest news" boxes from data/news-data.js (made by tools/fetch_news.py).
    // If the data file is missing, the placeholder boxes stay as they are.
    (function () {
      var data = window.NEWS_DATA;
      if (!data || !data.items || data.items.length === 0) { return; }

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
      var grid = document.getElementById("latest-news");
      var status = document.getElementById("news-status");
      grid.innerHTML = "";

      var flag = document.createElement("div");
      if (data.is_sample_data) {
        flag.className = "sample-flag";
        flag.textContent = "SAMPLE DATA: these items are fake test items, not real news.";
      } else {
        flag.className = "note";
        var names = [];
        data.items.forEach(function (item) {
          if (names.indexOf(item.source) === -1) { names.push(item.source); }
        });
        flag.textContent = "Headlines collected on " + data.collected_at + " from: " + names.join(", ") +
          ". Each item links to the original source. Short notes are taken from the source feed.";
      }
      status.appendChild(flag);

      data.items.forEach(function (item) {
        var card = document.createElement("article");
        card.className = "card";

        var tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = item.source;

        var h3 = document.createElement("h3");
        var link = document.createElement("a");
        if (/^https?:\/\//i.test(item.link || "")) { link.href = item.link; }
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.title;
        h3.appendChild(link);

        var note = document.createElement("p");
        note.textContent = item.note;

        var meta = document.createElement("div");
        meta.className = "meta";
        meta.appendChild(labelSpan("published", "Published"));
        meta.appendChild(document.createTextNode(": " + item.published + " \u00b7 "));
        meta.appendChild(labelSpan("original_language", "Original language"));
        meta.appendChild(document.createTextNode(": "));
        var langName = document.createElement("span");
        langName.setAttribute("data-lang-name", item.language || "");
        langName.textContent = item.language || "not stated by the source";
        meta.appendChild(langName);

        card.appendChild(tag);
        card.appendChild(h3);
        card.appendChild(note);
        card.appendChild(meta);
        addRelated(card, item);
        grid.appendChild(card);
      });
    })();
  
