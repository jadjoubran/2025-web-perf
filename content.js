import QRCode from "qrcode";

let contentTitle;

console.log(document.cookie);
function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  // boxLink.href = '#'
  boxLink.href = "/contentDetails.html?" + ob.id;
  // console.log('link=>' + boxLink);

  let imgTag = document.createElement("img");
  // imgTag.id = 'image1'
  // imgTag.id = ob.photos
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("rs  " + ob.price);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  boxDiv.onclick = function (event) {
    event.preventDefault();
    boxDiv.style.opacity = "0.7";

    // increment preview_click_count from localStorage
    let clicks_counts = window.localStorage.getItem("clicks_counts");
    if (clicks_counts) {
      clicks_counts = parseInt(clicks_counts) + 1;
    } else {
      clicks_counts = 1;
    }
    window.localStorage.setItem("clicks_counts", clicks_counts);
    // store it also in cookie
    document.cookie = "clicks_counts=" + clicks_counts + ";path=/";

    // open preview in dialog
    const dialog = document.createElement("dialog");
    dialog.style.width = "80%";
    dialog.style.height = "80%";

    const dialogImg = document.createElement("img");
    dialogImg.src = ob.preview;
    dialogImg.style.width = "100%";
    dialogImg.style.height = "100%";
    dialogImg.style.objectFit = "contain";

    const link = document.createElement("a");
    link.href = "/contentDetails.html?" + ob.id;
    link.textContent = "Go to details page";

    dialog.appendChild(dialogImg);
    dialog.appendChild(link);
    document.body.appendChild(dialog);
    const canvas = document.createElement("canvas");
    // Show all other products as related products in this dialog
    const container = event.currentTarget.parentElement;
    // Loop through products and remove current one
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      if (child !== boxDiv) {
        const relatedImg = child.querySelector("img").cloneNode();

        relatedImg.style.width = "100px";
        relatedImg.style.height = "100px";
        relatedImg.style.objectFit = "contain";
        relatedImg.style.margin = "10px";
        relatedImg.classList.add("related-product");

        dialog.appendChild(relatedImg);
        void relatedImg.offsetWidth;
        relatedImg.style.padding = "1px";
        const rect = relatedImg.getBoundingClientRect();
        console.log("Rect:", rect);
        relatedImg.style.border = "2px solid black";
        void relatedImg.getBoundingClientRect();
        relatedImg.style.border = "3px solid black";
        void relatedImg.getBoundingClientRect();

        QRCode.toCanvas(
          canvas,
          window.location.origin + "/contentDetails.html?" + ob.id
        );
      }
      dialog.appendChild(canvas);
    }

    const items = document.querySelectorAll(".related-product");
    items.forEach((item) => {
      item.style.width = Math.random() * 200 + "px";
      const width = item.getBoundingClientRect().width;
      console.log(width);
      const widths = JSON.parse(localStorage.getItem("random_widths") || "[]");
      widths.push(width);
      localStorage.setItem("random_widths", JSON.stringify(widths));
    });

    dialog.showModal();
    boxDiv.style.opacity = "1";
    dialog.addEventListener("click", () => {
      dialog.close();
    });
  };

  return boxDiv;
}

//  TO SHOW THE RENDERED CODE IN CONSOLE
// console.log(dynamicClothingSection());

// console.log(boxDiv)

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");
// mainContainer.appendChild(dynamicClothingSection('hello world!!'))

// BACKEND CALLING

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status == 200) {
      // console.log('call successful');
      contentTitle = JSON.parse(this.responseText);
      if (document.cookie.indexOf(",counter=") >= 0) {
        var counter = document.cookie.split(",")[1].split("=")[1];
        document.getElementById("badge").innerHTML = counter;
      }
      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isAccessory) {
          console.log(contentTitle[i]);
          containerAccessories.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
        } else {
          console.log(contentTitle[i]);
          containerClothing.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
        }
      }
    } else {
      console.log("call failed!");
    }
  }
};
httpRequest.open(
  "GET",
  "https://fh-salzburg-3e27a-default-rtdb.europe-west1.firebasedatabase.app/e-commerce.json",
  true
);
httpRequest.send();

var canvas = document.getElementById("qrcode-canvas");

QRCode.toCanvas(canvas, "https://google.com", function (error) {
  if (error) console.error(error);
  console.log("success!");
});
