export async function setItem(line: any) {
  if (line.item) {
    await line.populate("item");
    //fill fields
    line.description = line.item.description || "";
    line.price = await line.item.getPrice(line);
    // kitItem
    if (line.item && line.item.type === "KitItem") {
      await line.item.syncComponents(line);
    }
    line.depopulate("item");
  }
}
export async function setQuantity(line: any) {
  console.log("setVaule_quantity")
  if (line.item && line.item.type === "KitItem") {
    await line.item.syncComponents(line);
  }
}

