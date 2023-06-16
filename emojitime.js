// Script that animates emojitime.html
let prev_sec = 0;
let food_100_str =
  "🌶 🍓 🍉 🍒 🍎 🍅 🍑 🍊 🥕 🍍 🍋 🌽 🍌 🍈 🥑 🍐 🥝 🫒 🥭 🍏 🥗 🥒 🥬 🥦 🫛 🫑 🫐 🍆 🫘 🍇 🌰 🍠 🥔 🫚 🥜 🧅 🥓 🍗 🍖 🥩 🍣 🍤 🥟 🌮 🫔 🥐 🥯 🥨 🌭 🍔 🥪 🍞 🥖 🧇 🥞 🧈 🍪 🥠 🧋 🍦 🍰 🧁 🍨 🎂 🥧 🧀 🍯 🥘 🍱 🍜 🍭 🥣 🧊 🍬 🍩 🍫 🥮 🍡 🍢 🥚 🍚 🍧 🥡 🍥 🧂 🍶 🥛 🫖 🍵 🍲 ☕ 🍙 🥥 🧄 🍛 🍄 🍿 🥤 🍝 🥫 🫕";
// first 12 of these are months; first 24 of these are hours; first 31 of these are days;
// first 60 of these are minutes/seconds; first 100 of these are years of the century
let animals_100_str =
  "🐊 🦎 🐸 🐢 🐍 🐲 🐉 🦖 🦕 🦋 🐳 🐋 🐬 🐟 🐠 🐡 🦀 🦞 🦐 🦑 🦧 🐻 🦦 🦔 🦥 🦇 🐗 🐒 🦘 🦒 🐆 🐅 🐂 🐃 🐎 🐫 🐪 🦌 🐕 🐐 🦓 🦍 🐘 🦏 🦛 🦝 🦡 🐀 🐁 🐇 🐓 🐔 🦢 🕊 🦆 🐤 🦃 🦉 🦜 🦚 🐛 🪲 🐝 🐞 🐌 🦂 🦗 🪰 🐜 🦟 🦨 🐧 🐕‍🦺 🦅 🐣 🦁 🐯 🦊 🐿 🦩 🪸 🦄 🐖 🐄 🫏 🦭 🦈 🦪 🐚 🪿 🦙 🐏 🐑 🐩 🐈 🦮 🐴 🦣 🫎 🦫";

let animals_100 = animals_100_str.split(" ");
let food_100 = food_100_str.split(" ");
let source_100 = animals_100;

function update_date() {
  let now = new Date();
  const year = now.getFullYear() % 100;
  const month = now.getMonth();
  const dayOfMonth = now.getDate() - 1;

  let [emojiYear, emojiMonth, emojiDayOfMonth] = [
    source_100[year],
    source_100[month],
    source_100[dayOfMonth],
  ];
  let emojiDate = emojiYear + " " + emojiMonth + " " + emojiDayOfMonth;

  let animojiDate = document.getElementById("animoji_date");
  animojiDate.innerHTML =
    now.toISOString().slice(2, 10) + "<br>" + emojiDate;
}

// Use event listener to render after click
let more_info = document.getElementById("more_info");
more_info.addEventListener("click", (e) => {
  // Show emoji table for interested users
  document.getElementById("emoji_table").hidden = false;
  document.getElementById("note").hidden = !more_info.checked;
  document.getElementById("note").style.display = more_info.checked
    ? "table"
    : "none";
  document.getElementById("show_food_chkbox").hidden = !more_info.checked;

  // Hide elelemnts again
  let animoji_date = document.getElementById("animoji_date");
  animoji_date.hidden = !more_info.checked;
  animoji_date.style.display = more_info.checked ? "block" : "none";
  let emoji_table = document.getElementById("emoji_table");
  emoji_table.hidden = !more_info.checked;
  let note = document.getElementById("note");
  note.hidden = !more_info.checked;
});

let show_food = document.getElementById("show_food");
show_food.addEventListener("click", (e) => {
  show_food = document.getElementById("show_food");
  if (show_food.checked) {
    source_100 = food_100;
    document.getElementById(
      "show_food"
    ).nextSibling.nextSibling.textContent = "🐷 oink oink oink";
  } else {
    source_100 = animals_100;
    document.getElementById(
      "show_food"
    ).nextSibling.nextSibling.textContent = "🍪 nom nom nom";
  }
  set_emoji_table(source_100);
  update_date();
  setEmojiClock();
});

let emojiBox = document.getElementById("emojis");
emojiBox.addEventListener("click", (e) => {
  let emojis = document.getElementById("emojis");
  let text = "";
  for (let child of emojis.children) {
    if (window.getComputedStyle(child).display === "block") {
      text += child.innerHTML.split("<br>")[1].replace(/ /g, "");
    }
  }
  navigator.clipboard.writeText(text).then(() => {
    if (!document.getElementById("copied_modal")) {
      // no dupes
      emojiBox.insertAdjacentHTML(
        "afterend",
        '<p id=copied_modal style="display:flex;">Copied "' +
          text +
          '"!</p>'
      );
      setTimeout(() => {
        document.getElementById("copied_modal").remove();
      }, 2000);
    }
  });
});

// Set up 10x10 emoji table
function set_emoji_table(source_emojis) {
  let emojiTable = document.getElementById("emoji_table");
  [...emojiTable.childNodes].forEach((node) => node.remove());
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let header = "<tr><th></th>"; // empty initial cell for vertical thead
  for (let i = 0; i < 10; ++i) {
    header += "<th>" + i.toString() + "</th>";
    let row = "<tr><td><strong>" + i.toString() + "</strong></td>";
    for (let j = 0; j < 10; ++j) {
      let num = i * 10 + j;
      row += "<td>" + source_emojis[num] + "</td>";
    }
    row += "</tr>";
    tbody.insertAdjacentHTML("beforeend", row);
  }
  thead.insertAdjacentHTML("beforeend", header + "</tr>");
  emojiTable.append(thead);
  emojiTable.append(tbody);
}
set_emoji_table(animals_100);

let lastDate = "";
let setEmojiClock = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  let [emojiHours, emojiMinutes, emojiSeconds] = [
    source_100[hours],
    source_100[minutes],
    source_100[seconds],
  ];
  let pad = (num) => num.toString().padStart(2, "0");
  let date = now.toString().slice(0, 10); // doesn't need to be iso and utc so long as it's unique
  let timeText = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

  let emojiTime = emojiHours + " " + emojiMinutes + " " + emojiSeconds;

  if (date !== lastDate) {
    update_date();
    lastDate = now.toString().slice(0, 10);
  }

  document.getElementById("animoji_time").innerHTML =
    timeText + "<br>" + emojiTime;
  // console.log((timeText + emojiTime).replace(/&nbsp/g, ' '));
};
setEmojiClock();
let timeoutId = setInterval(setEmojiClock, 1000);
