const fs = require("fs");
const https = require("https");

const items = [
    { name: "tradao", keyword: "peach,tea" },
    { name: "kemvani", keyword: "vanilla,icecream" },
    { name: "mitokbokki", keyword: "spicy,noodles" },
    { name: "banhcom", keyword: "korean,pancake" },
    { name: "tokbokkiphomai", keyword: "cheese,tteokbokki" },
    { name: "banhgao", keyword: "ricecake,korean" },
    { name: "ganbo", keyword: "beef,bbq" },
    { name: "luoncuu", keyword: "lamb,bbq" }
];

items.forEach((item) => {
    const url = `https://loremflickr.com/400/400/${item.keyword}`;
    https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            https.get(res.headers.location, (imgRes) => {
                const file = fs.createWriteStream(`public/menu/${item.name}.jpg`);
                imgRes.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log(`Downloaded ${item.name}.jpg`);
                });
            });
        } else {
            console.log(`Could not get direct URL for ${item.name}`);
        }
    }).on("error", (e) => {
        console.error(`Error downloading ${item.name}: ${e.message}`);
    });
});
