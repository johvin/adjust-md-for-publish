const fs = require('fs');
const path = require('path');

module.exports = adjustMarkdown;

function adjustMarkdown(config) {
  const {
    filename,
    destname,
    filterSection = []
  } = config;

  const resolveFromPath = path.resolve(filename);
  const basename = path.basename(resolveFromPath);

  if (!destname) {
    destname = basename.replace(/\.([^.]+)$/, '.adjust$&');
  }
  const resolveToPath = path.resolve(destname);

  const data = fs.readFileSync(resolveFromPath, 'utf-8');
  let newDoc;

  // filter some chapter sections
  if (filterSection.length > 0) {
    const tree = parseDocToTree(data, basename.replace(/\.([^.]+)$/, ''));

    treeDFS(tree, function (item, parent) {
      if (typeof item === 'object') {
        if (filterSection.includes(item.title)) {
          const index = parent.findIndex(x => x === item);
          parent.splice(index, 1);
        }
      }
    });

    newDoc = treeToDoc(tree);
  }

  fs.writeFileSync(resolveToPath, newDoc || data, 'utf-8');
}

// parse a md document to an abstract document tree
function parseDocToTree(doc, defaultTitle) {
  // save the parsed tree
  const tree = [];
  const lines = doc.split('\n');
  let line, m;

  // 保存一个文档区域
  let section = null;
  let parentSection = null;
  // if in a ``` block
  let inBlock = false;

  // little trick，如果第一行不是 #，则增加一个 #
  if (!/^#(?!#)/.test(lines[0])) {
    lines.unshift('# ' + defaultTitle);
  }

  while ((line = lines.shift()) !== undefined) {
    m = line && line.match(/^(#+)(?!#)(.*)$/);

    if (!inBlock && m && m.length == 3) {
      section = {
        title: m[2].trim(),
        level: m[1].length,
        parent: null,
        children: []
      };

      while (parentSection && parentSection.level >= section.level) {
        parentSection = parentSection.parent;
      }

      if (parentSection) {
        section.parent = parentSection;
        parentSection.children.push(section);
        parentSection = section;
      } else {
        tree.push(section);
        parentSection = section;
      }
    } else if (section) {
      if (line.indexOf('```') === 0) {
        inBlock = !inBlock;
      }
      section.children.push(line);
    } else {
      throw new Error(`NOT VALID LINE: ${line}`);
    }
  }

  return tree;
}

// traverse tree with dfs
function treeDFS(tree, callback) {
  for (let it of tree.slice()) {
    callback(it, tree);
    if (typeof it === 'object') {
      treeDFS(it.children, callback);
    }
  }
}

// convert an abstract md tree to document
function treeToDoc(tree) {
  if (tree.length === 0) return '';

  return tree.map((it) => {
    if (typeof it === 'object') {
      return `${'#'.repeat(it.level)} ${it.title}\n${treeToDoc(it.children)}`;
    }
    return it;
  }).join('\n');
}
