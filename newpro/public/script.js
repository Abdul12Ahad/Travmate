async function searchWiki() {
    const query = document.getElementById("search").value;
    if (!query) return;

    const response = await fetch(`http://localhost:3000/wiki/${query}`);
    const data = await response.json();

   if (data.type === "disambiguation") {
        document.getElementById("result").innerHTML = "This topic has multiple meanings. Try being more specific.";
   } else {
       document.getElementById("result").innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.extract}</p>
            ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="${data.title}">` : ""}
            <br>
            <a href="${data.content_urls.desktop.page}" target="_blank">Read more on Wikipedia</a>
        `;
    }
}