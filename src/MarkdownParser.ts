const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;

let currentContainer: HTMLElement | null = null;

let inlineCodeBlock: boolean = false;
let codeBlock: boolean = false;
let codeBlockBacktickCount: number = 0;
let currentCodeBlockContent: string = "";
let bold: boolean = false;
let italics: boolean = false;
let headingLevel: number = 0;
let list: boolean = false;
let currentTextNode: Text | null = null;

// Do not edit this method
function runStream() {
  currentContainer = document.getElementById("markdownContainer")!;
  currentTextNode = document.createTextNode("");
  currentContainer.appendChild(currentTextNode);

  // this randomly split the markdown into tokens between 2 and 20 characters long
  // simulates the behavior of an ml model thats giving you weirdly chunked tokens
  const tokens: string[] = [];
  let remainingMarkdown = blogpostMarkdown;
  while (remainingMarkdown.length > 0) {
    const tokenLength = Math.floor(Math.random() * 18) + 2;
    const token = remainingMarkdown.slice(0, tokenLength);
    tokens.push(token);
    remainingMarkdown = remainingMarkdown.slice(tokenLength);
  }

  const toCancel = setInterval(() => {
    const token = tokens.shift();
    if (token) {
      addToken(token);
    } else {
      clearInterval(toCancel);
    }
  }, 20);
}

/* 
Please edit the addToken method to support at least inline codeblocks and codeblocks. Feel free to add any other methods you need.
This starter code does token streaming with no styling right now. Your job is to write the parsing logic to make the styling work.

Note: don't be afraid of using globals for state. For this challenge, speed is preferred over cleanliness.
 */
function addToken(token: string) {
  if (!currentContainer || !currentTextNode) return;

  let text = token;
  let codeBlockElement: HTMLElement | null = null;
  let codeSpan: HTMLElement | null = null;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (codeBlock) {
      codeBlockBacktickCount = 0;
      currentCodeBlockContent += char;

      if (i == text.length - 1) {
        currentTextNode.textContent = currentCodeBlockContent;
      }
    } else if (char === "`") {
      if (inlineCodeBlock) {
        // Closing inline code block
        currentTextNode = document.createTextNode("");
        currentContainer.appendChild(document.createTextNode("</code>"));
        currentContainer.appendChild(currentTextNode);

        inlineCodeBlock = false;
      } else if (text[i + 1] && text[i + 1] != "`") {
        // Opening inline code block
        currentTextNode.textContent = currentTextNode.textContent
          ? currentTextNode.textContent
          : "";
        currentTextNode.textContent += "`";
        currentTextNode = document.createTextNode("");
        currentContainer.appendChild(
          document.createTextNode("<code style='background-color: lightgray;'>")
        );

        currentContainer.appendChild(currentTextNode);

        inlineCodeBlock = true;
      } else if (
        text[i + 1] &&
        text[i + 1] == "`" &&
        text[i + 2] &&
        text[i + 2] == "`"
      ) {
        i += 2;
        codeBlock = true;

        codeBlockElement = document.createElement("pre");
        codeBlockElement.style.background = "lightblue";
        codeBlockElement.style.padding = "10px";
        currentContainer.appendChild(codeBlockElement);

        currentCodeBlockContent = "";
        currentTextNode = document.createTextNode("");
        codeSpan = document.createElement("code");
        codeBlockElement.appendChild(codeSpan);
        codeBlockElement.appendChild(currentTextNode);
      }
    } else if (char === "*") {
      if (text[i + 1] && text[i + 1] == "*") {
        i++;
        if (bold) {
          currentTextNode = document.createTextNode("");
          currentContainer.appendChild(document.createTextNode("</strong>"));
          currentContainer.appendChild(currentTextNode);
          bold = false;
        } else {
          currentTextNode.textContent = currentTextNode.textContent
            ? currentTextNode.textContent
            : "";
          currentTextNode.textContent += "**";

          currentTextNode = document.createTextNode("");
          currentContainer.appendChild(document.createTextNode("<strong>"));
          currentContainer.appendChild(currentTextNode);
          bold = true;
        }
      } else if (italics) {
        currentTextNode = document.createTextNode("");
        currentContainer.appendChild(document.createTextNode("</i>"));
        currentContainer.appendChild(currentTextNode);
        italics = false;
      } else {
        currentTextNode.textContent = currentTextNode.textContent
          ? currentTextNode.textContent
          : "";
        currentTextNode.textContent += "*";

        currentTextNode = document.createTextNode("");
        currentContainer.appendChild(document.createTextNode("<i>"));
        currentContainer.appendChild(currentTextNode);

        italics = true;
      }
    } else if (char === "_") {
      if (text[i + 1] && text[i + 1] == "_") {
        i++;
        if (bold) {
          currentTextNode = document.createTextNode("");
          currentContainer.appendChild(document.createTextNode("</strong>"));
          currentContainer.appendChild(currentTextNode);
          bold = false;
        } else {
          currentTextNode.textContent = currentTextNode.textContent
            ? currentTextNode.textContent
            : "";
          currentTextNode.textContent += "__";

          currentTextNode = document.createTextNode("");
          currentContainer.appendChild(document.createTextNode("<strong>"));
          currentContainer.appendChild(currentTextNode);
          bold = true;
        }
      } else if (italics) {
        currentTextNode = document.createTextNode("");
        currentContainer.appendChild(document.createTextNode("</i>"));
        currentContainer.appendChild(currentTextNode);
        italics = false;
      } else {
        currentTextNode.textContent = currentTextNode.textContent
          ? currentTextNode.textContent
          : "";
        currentTextNode.textContent += "_";

        currentTextNode = document.createTextNode("");
        currentContainer.appendChild(document.createTextNode("<i>"));
        currentContainer.appendChild(currentTextNode);

        italics = true;
      }
    } else if (char === "#") {
      headingLevel = 1;
      while (text[i + headingLevel] == "#") {
        headingLevel++;
      }
      i += headingLevel - 1;
      currentTextNode = document.createTextNode("");
      currentContainer.appendChild(
        document.createTextNode(`<h${headingLevel}>`)
      );
      currentContainer.appendChild(currentTextNode);
    } else if (char === "-") {
      list = true;
      currentTextNode = document.createTextNode("");
      currentContainer.appendChild(document.createTextNode("<li>"));
      currentContainer.appendChild(currentTextNode);
    } else {
      if (inlineCodeBlock) {
        currentTextNode.textContent += char;
      } else {
        currentTextNode.textContent += char;
      }
    }
  }

  if (codeBlock) {
    if (text.endsWith("```")) {
      codeBlock = false;
      if (codeBlockElement) {
        currentTextNode = document.createTextNode("");
        codeBlockElement.appendChild(document.createTextNode("</code></pre>"));
      }
    }
  }
  if (headingLevel > 0) {
    currentTextNode = document.createTextNode("");
    currentContainer.appendChild(
      document.createTextNode(`</h${headingLevel}>`)
    );
    currentContainer.appendChild(currentTextNode);
    headingLevel = 0;
  }
  if (list) {
    currentTextNode = document.createTextNode("");
    currentContainer.appendChild(document.createTextNode("</li>"));
    currentContainer.appendChild(currentTextNode);

    list = false;
  }
}
