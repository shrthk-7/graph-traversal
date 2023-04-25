import p5 from "p5";

const initializeMatrix = (rows = 1, cols = 1, matrix = []) => {
  for (let i = 0; i < rows; i++) {
    const list = [];
    for (let j = 0; j < cols; j++) {
      list.push(0);
    }
    matrix.push(list);
  }
};

const sketch = (p = new p5()) => {
  const nodes = [];
  const lines = [];
  const adjMatrix = [];
  const diameter = 20;

  p.setup = function () {
    const canvas = p.createCanvas(400, 400);
    p.background(100);
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

    const submitBtn = p.createButton("Graph created");

    // graph creation finished
    submitBtn.mouseClicked(() => {
      submitBtn.html("Start BFS");
      initializeMatrix(nodes.length, nodes.length, adjMatrix);

      let mouseClickStartX = null;
      let mouseClickStartY = null;

      canvas.mouseClicked(false);
      canvas.mousePressed(() => {
        mouseClickStartX = this.mouseX;
        mouseClickStartY = this.mouseY;
      });
      canvas.mouseReleased(() => {
        if (!mouseClickStartX || !mouseClickStartY) return;

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

      submitBtn.mouseClicked(() => {
        canvas.mousePressed(false);
        canvas.mouseReleased(false);

        alert("BFS Started");
      });
    });

    p.draw = () => {
      p.background(100);
      nodes.forEach((node) => {
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
