import p5 from "p5";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const initializeMatrix = (rows = 1, cols = 1, matrix = []) => {
  for (let i = 0; i < rows; i++) {
    const list = [];
    for (let j = 0; j < cols; j++) {
      list.push(0);
    }
    matrix.push(list);
  }
};

// const initializeNodesForBFS = (nodes = []) => {
// };

const startBFS = async (nodes = [], adjMatrix = [], redraw = () => {}) => {
  for (let i in nodes) {
    nodes[i].color = i === 0 ? 100 : 255;
    nodes[i].index = i;
  }

  const q = [{ ...nodes[0] }];
  await sleep(500);

  while (q.length !== 0) {
    let size = q.length;
    while (size--) {
      const node = q.shift();
      const idx = node.index;

      for (let i in nodes) {
        if (adjMatrix[idx][i] !== 1 || nodes[i].color !== 255) continue;
        q.push({ ...nodes[i] });
        nodes[i].color = 100;
        // redraw();
        // await sleep(500);
      }
      nodes[idx].color = 0;
      redraw();
      await sleep(100);
    }
  }
};

const sketch = (p = new p5()) => {
  const bgColor = [100, 20, 200];
  const nodes = [];
  const adjMatrix = [];
  const diameter = 20;

  p.setup = function () {
    const canvas = p.createCanvas(400, 400);
    p.frameRate(10);
    p.background(bgColor);
    p.strokeWeight(2);

    // adding nodes
    canvas.mouseClicked(() => {
      const data = {
        x: this.mouseX,
        y: this.mouseY,
      };

      // check if they are too near
      for (let node of nodes) {
        if (p.dist(data.x, data.y, node.x, node.y) <= 2 * diameter) return;
      }

      nodes.push(data);
    });

    // graph creation finished
    const submitBtn = p.createButton("Graph created");
    submitBtn.mouseClicked(() => {
      submitBtn.html("Start BFS");
      initializeMatrix(nodes.length, nodes.length, adjMatrix);

      let mouseClickStartX = null;
      let mouseClickStartY = null;

      canvas.mouseClicked(false);
      canvas.mouseClicked(() => {
        if (!mouseClickStartX || !mouseClickStartY) {
          mouseClickStartX = this.mouseX;
          mouseClickStartY = this.mouseY;
          return;
        }

        const line = {
          x1: mouseClickStartX,
          y1: mouseClickStartY,
          x2: this.mouseX,
          y2: this.mouseY,
        };

        mouseClickStartX = null;
        mouseClickStartY = null;

        let nodeA = null;
        let nodeB = null;

        nodes.forEach((node, i) => {
          if (p.dist(node.x, node.y, line.x1, line.y1) > diameter) return;
          nodeA = i;
        });
        nodes.forEach((node, i) => {
          if (p.dist(node.x, node.y, line.x2, line.y2) > diameter) return;
          nodeB = i;
        });

        if (nodeA === nodeB || nodeA === null || nodeB === null) return;

        adjMatrix[nodeA][nodeB] = 1;
        adjMatrix[nodeB][nodeA] = 1;
      });
      // canvas.mousePressed(() => {
      //   mouseClickStartX = this.mouseX;
      //   mouseClickStartY = this.mouseY;
      // });
      // canvas.mouseReleased(() => {
      //   if (!mouseClickStartX || !mouseClickStartY) return;

      //   const line = {
      //     x1: mouseClickStartX,
      //     y1: mouseClickStartY,
      //     x2: this.mouseX,
      //     y2: this.mouseY,
      //   };

      //   mouseClickStartX = null;
      //   mouseClickStartY = null;

      //   let nodeA = null;
      //   let nodeB = null;

      //   nodes.forEach((node, i) => {
      //     if (p.dist(node.x, node.y, line.x1, line.y1) > diameter) return;
      //     nodeA = i;
      //   });
      //   nodes.forEach((node, i) => {
      //     if (p.dist(node.x, node.y, line.x2, line.y2) > diameter) return;
      //     nodeB = i;
      //   });

      //   if (nodeA === nodeB || nodeA === null || nodeB === null) return;

      //   adjMatrix[nodeA][nodeB] = 1;
      //   adjMatrix[nodeB][nodeA] = 1;
      // });

      submitBtn.mouseClicked(() => {
        submitBtn.html("BFS-ing");
        canvas.mousePressed(false);
        canvas.mouseReleased(false);

        p.noLoop();
        startBFS(nodes, adjMatrix, () => p.redraw());
      });
    });

    p.draw = () => {
      p.background(bgColor);

      if (!p.isLooping()) console.log([...nodes].map((node) => node.color));

      nodes.forEach((node) => {
        p.fill(node.color ?? 255);
        p.circle(node.x, node.y, diameter);
      });

      for (let i = 0; i < adjMatrix.length; i++) {
        for (let j = i + 1; j < adjMatrix.length; j++) {
          if (adjMatrix[i][j] === 0) continue;
          p.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        }
      }
    };
  };
};

export default sketch;
