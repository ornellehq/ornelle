export const slugify = (text: string, separator?: string) => {
  let lText = text.toString().toLowerCase().trim()

  const sets = [
    { to: "a", from: "[ÀÁÂÃÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶΑΆ]" },
    { to: "b", from: "[Β]" },
    { to: "ae", from: "[Ä]" },
    { to: "c", from: "[ÇĆĈČ]" },
    { to: "d", from: "[ÐĎĐÞΔ]" },
    { to: "e", from: "[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆΕΈ]" },
    { to: "f", from: "[Φ]" },
    { to: "g", from: "[ĜĞĢǴΓ]" },
    { to: "h", from: "[ĤḦ]" },
    { to: "i", from: "[ÌÍÎÏĨĪĮİỈỊΗΉΙΊΪΐ]" },
    { to: "j", from: "[Ĵ]" },
    { to: "ij", from: "[Ĳ]" },
    { to: "k", from: "[ĶΚ]" },
    { to: "ks", from: "[Ξ]" },
    { to: "l", from: "[ĹĻĽŁΛ]" },
    { to: "m", from: "[ḾΜ]" },
    { to: "n", from: "[ÑŃŅŇΝ]" },
    { to: "o", from: "[ÒÓÔÕØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠΟΌΩΏ]" },
    { to: "oe", from: "[ŒÖ]" },
    { to: "p", from: "[ṕΠ]" },
    { to: "ps", from: "[Ψ]" },
    { to: "r", from: "[ŔŖŘΡ]" },
    { to: "s", from: "[ŚŜŞŠΣς]" },
    { to: "ss", from: "[ß]" },
    { to: "t", from: "[ŢŤΤ]" },
    { to: "th", from: "[Θ]" },
    { to: "u", from: "[ÙÚÛŨŪŬŮŰŲỤỦỨỪỬỮỰƯΥΎΫΰ]" },
    { to: "ue", from: "[Ü]" },
    { to: "w", from: "[ẂŴẀẄ]" },
    { to: "x", from: "[ẍΧ]" },
    { to: "y", from: "[ÝŶŸỲỴỶỸ]" },
    { to: "z", from: "[ŹŻŽΖ]" },
    { to: "-", from: "[·/_,:;']" },
  ]

  for (const set of sets) {
    lText = lText.replace(new RegExp(set.from, "gi"), set.to)
  }

  lText = lText
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text

  if (typeof separator !== "undefined" && separator !== "-") {
    lText = lText.replace(/-/g, separator)
  }

  return lText
}
