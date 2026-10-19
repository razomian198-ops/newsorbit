    // Lists the sources found in the collected headlines (data/news-data.js).
    (function () {
      var data = window.NEWS_DATA;
      var holder = document.getElementById("source-list");
      if (!data || !data.items || data.items.length === 0) { return; }
      var counts = {};
      data.items.forEach(function (item) { counts[item.source] = (counts[item.source] || 0) + 1; });
      holder.innerHTML = "";
      if (data.is_sample_data) {
        var warn = document.createElement("p");
        warn.textContent = "SAMPLE DATA: the source below is a fake test source, not a real one.";
        holder.appendChild(warn);
      }
      var list = document.createElement("ul");
      Object.keys(counts).forEach(function (name) {
        var li = document.createElement("li");
        li.textContent = name + " \u2013 " + counts[name] + " headline(s), collected on " + data.collected_at;
        list.appendChild(li);
      });
      holder.appendChild(list);
    })();
  
