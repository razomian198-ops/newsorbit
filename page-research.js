    // Shows the documents collected by tools/fetch_research.py (data/research-data.js).
    (function () {
      var data = window.RESEARCH_DATA;
      var status = document.getElementById("research-status");
      var holder = document.getElementById("documents");
      var filterBox = document.getElementById("filter");

      if (!data || !data.items) {
        status.textContent = "No research documents were found. Run tools/fetch_research.py first.";
        return;
      }

      function labelSpan(key, fallback) {
        var s = document.createElement("span");
        s.setAttribute("data-i18n", key);
        s.textContent = fallback;
        return s;
      }
      function text(value) { return document.createTextNode(value); }

      function render() {
        var words = filterBox.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        var shown = data.items.filter(function (d) {
          var haystack = (d.title + " " + d.type + " " + d.agencies.join(" ") + " " + d.summary).toLowerCase();
          return words.every(function (w) { return haystack.indexOf(w) !== -1; });
        });
        holder.innerHTML = "";
        status.textContent = shown.length + " / " + data.items.length + "  \u00b7  " + data.collected_at;

        if (shown.length === 0) {
          var none = document.createElement("div");
          none.className = "story";
          none.setAttribute("data-i18n", "no_documents");
          none.textContent = "No documents match your filter.";
          holder.appendChild(none);
        }

        shown.forEach(function (d) {
          var box = document.createElement("article");
          box.className = "story";

          var h2 = document.createElement("h2");
          var a = document.createElement("a");
          if ((d.link || "").indexOf("https://www.federalregister.gov/") === 0) { a.href = d.link; } a.target = "_blank"; a.rel = "noopener noreferrer";
          a.textContent = d.title;
          h2.appendChild(a);
          box.appendChild(h2);

          if (d.summary) {
            var p = document.createElement("p");
            p.textContent = d.summary;
            box.appendChild(p);
          }

          var meta = document.createElement("div");
          meta.className = "meta";
          meta.appendChild(labelSpan("jurisdiction", "Jurisdiction"));
          meta.appendChild(text(": "));
          if (data.jurisdiction === "United States (federal)") {
            meta.appendChild(labelSpan("jurisdiction_us", "United States (federal)"));
          } else {
            meta.appendChild(text(data.jurisdiction));
          }
          meta.appendChild(text(" \u00b7 "));
          meta.appendChild(labelSpan("doc_type", "Type"));
          meta.appendChild(text(": " + d.type + " \u00b7 "));
          meta.appendChild(labelSpan("published", "Published"));
          meta.appendChild(text(": " + d.date));
          if (d.agencies.length > 0) {
            meta.appendChild(text(" \u00b7 "));
            meta.appendChild(labelSpan("agencies", "Agencies"));
            meta.appendChild(text(": " + d.agencies.join(", ")));
          }
          meta.appendChild(text(" \u00b7 "));
          meta.appendChild(labelSpan("official_source", "Official source"));
          meta.appendChild(text(": Federal Register"));
          box.appendChild(meta);
          holder.appendChild(box);
        });

        if (window.NewsOrbitRefreshLanguage) { window.NewsOrbitRefreshLanguage(); }
      }

      filterBox.addEventListener("input", render);
      render();
    })();
  
