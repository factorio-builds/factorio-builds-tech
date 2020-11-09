"use strict"
const fs = require("fs")
const path = require("path")
const request = require("request")

let jsonData = JSON.parse(fs.readFileSync("utils/image-sources.json", "utf-8"))

const sizes = ["small", "medium", "large"].forEach((size) => {
  jsonData[size].forEach((img) => {
    var src = jsonData.base_path + img
    var filename = path.basename(img).toLowerCase()
    var dest = filename

    const formats = ["32px-", "48px-"].forEach((px) => {
      if (filename.indexOf(px) != -1) {
        dest = filename.substr(px.length)
      }
    })

    dest = dest.replace(/_/g, "-")

    console.info(src + " => " + dest)
    request(src).pipe(
      fs.createWriteStream("./public/img/icons/" + size + "/" + dest)
    )
  })
})
