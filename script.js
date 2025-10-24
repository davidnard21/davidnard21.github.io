
// ------- Simple file explorer -------

function createExplorer(rootId) {
  const root = document.getElementById(rootId);
  const structure = [];

  function addFolder(name, callback) {
    const folder = { name, type: "folder", children: [] };
    structure.push(folder);
    if (callback) callback({
      addFolder: (childName, childCb) => {
        const childFolder = { name: childName, type: "folder", children: [] };
        folder.children.push(childFolder);
        if (childCb) childCb({
          addFolder: (n, cb) => addTo(childFolder, n, "folder", cb),
          addFile: n => addTo(childFolder, n, "file")
        });
      },
      addFile: n => folder.children.push({ name: n, type: "file" })
    });
  }

  function addTo(parent, name, type, cb) {
    if (type === "folder") {
      const f = { name, type, children: [] };
      parent.children.push(f);
      if (cb) cb({
        addFolder: (n, c) => addTo(f, n, "folder", c),
        addFile: n => addTo(f, n, "file")
      });
    } else {
      parent.children.push({ name, type });
    }
  }

  function render(data, container) {
    const ul = document.createElement("ul");
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = (item.type === "folder" ? "📂 " : "📄 ") + item.name;

      if (item.type === "folder" && item.children) {
        const childTree = render(item.children, li);
        childTree.style.display = "none";

        li.addEventListener("click", e => {
          e.stopPropagation();
          childTree.style.display = childTree.style.display === "none" ? "block" : "none";
        });

        li.appendChild(childTree);
      } else if (item.type === "file") {
        li.addEventListener("click", e => {
          e.stopPropagation();
          alert("Opening file: " + item.name);
        });
      }

      ul.appendChild(li);
    });
    return ul;
  }

  function build() {
    root.appendChild(render(structure, root));
  }

  return { addFolder, addFile: name => structure.push({ name, type: "file" }), build };
}

// ------- Example usage -------

const explorer = createExplorer("fileTree");

explorer.addFolder("src", src => {
  src.addFile("index.html");
  src.addFile("main.js");

  src.addFolder("components", comp => {
    comp.addFile("header.js");
    comp.addFile("footer.js");
  });
});

explorer.addFolder("assets", assets => {
  assets.addFile("logo.png");
  assets.addFile("style.css");
});

explorer.addFile("README.md");

explorer.build();
