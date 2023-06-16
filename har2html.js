const fileSelector = document.getElementById("fileSelector");
fileSelector.addEventListener("change", (event) => {
  let [file] = event.target.files;
  document.getElementById("download_html_btn").hidden = true;
  function readHARFile(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener(
      "load",
      () => {
        let DEBUG = false;
        let iframe = document.getElementById("har_html_iframe");
        let avail_height =
          screen.availHeight -
          100 -
          document.getElementById("fileSelector").clientHeight -
          document.getElementById("fileSelector").clientHeight;
        let reader_text = reader.result;
        let reader_json = JSON.parse(reader_text);
        let url_coverage = [];
        let iframe_html = "";
        let base_url = "";
        let iframe_css = "";
        let iframe_js = "";
        let imgs = {};
        for (let request of reader_json.log.entries) {
          let text = request.response.content.text; // don't lowercase text as case could matter
          if (
            request.response.status < 200 ||
            request.response.status >= 400 ||
            !text
          ) {
            continue; // Only use content with a 200 status code.
          }
          let url = request.request.url.toLowerCase();
          let mimeType = request.response.content.mimeType.toLowerCase();
          let encoding = request.response.content?.encoding?.toLowerCase();
          let covered = true;
          if (mimeType.startsWith("text/html") && iframe_html === "") {
            iframe_html = text;
            base_url = url;
          } else if (mimeType.startsWith("text/css")) {
            iframe_css += text;
          } else if (mimeType.includes("javascript")) {
            iframe_js += text;
            // binary fonts wont work, but some css fonts will
          } else if (
            mimeType.startsWith("image") ||
            mimeType.includes("font")
          ) {
            let img_data = "data:" + mimeType + ";" + encoding + "," + text;
            imgs[url] = img_data;
          } else {
            covered = false;
          }
          url_coverage.push(
            (covered ? "✅" : "❌") +
              " " +
              mimeType +
              " " +
              encoding +
              " " +
              url
          );
        }
        console.log("URL coverage:", url_coverage);
        if (iframe_html === "") {
          alert(
            "No text/html request found. Make sure your HAR file is valid."
          );
          return;
        }
        if (DEBUG) {
          let url_list = document.getElementById("url_list");
          url_list.hidden = false;
          url_list.textContent = JSON.stringify(url_coverage, null, 2);
        }
        for (let url of Object.keys(imgs)) {
          // replace image text in html and css
          let img_datum = imgs[url];
          let relative_path = url.split(base_url)[1];
          iframe_html = iframe_html.replaceAll(
            '<img src="' + relative_path + '"',
            '<img src="' + img_datum + '"'
          );
          iframe_html = iframe_html.replaceAll(
            '<img src="' + url + '"',
            '<img src="' + img_datum + '"'
          );
          iframe_css = iframe_css.replaceAll(
            'url("' + relative_path + '")',
            'url("' + img_datum + '")'
          );
          iframe_css = iframe_css.replaceAll(
            'url("' + url + '")',
            'url("' + img_datum + '")'
          );
        }
        // Break up tags so that HTML doesn't parse it as HTML
        let replace_text = "<" + "style" + ">" + iframe_css + "</" + "style" + "></" + "head" + ">";
        iframe_html = iframe_html.replace("</" + "head>", replace_text);
        // Run JS at end of document
        replace_text = "<" + "script" + ">" + iframe_js + "</" + "script" + "></" + "body>";
        iframe_html = iframe_html.replace("</" + "body" + ">", replace_text);
        iframe.srcdoc = iframe_html;
        // resize iframe height dynamically
        iframe.onload = () => {
          iframe.style.height = avail_height + "px";
          iframe.style.width = "100%";
          // allow downloads if har file has loaded
          let dlBtn = document.getElementById("download_html_btn");
          dlBtn.hidden = false;
          dlBtn.dataset.filename = file.name + ".html";
        };
        // Download HTML file logic
        let btn = document.getElementById("download_html_btn");
        function handleButton(e) {
          e.preventDefault();
          const string = document.querySelector("#download_html_btn").value;
          const element = document.createElement("a");
          const newFile = new Blob([iframe_html], { type: "text/html" });
          element.href = URL.createObjectURL(newFile);
          let dlBtn = document.getElementById("download_html_btn");
          element.download = dlBtn.dataset.filename;
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        }
        btn.removeEventListener("click", handleButton);
        btn.addEventListener("click", handleButton);
      },
      false
    );
  }
  readHARFile(file);
});
