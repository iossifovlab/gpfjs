export interface Graph<T> {
    addVertex(vertex: Vertex<T>, edges: Array<Edge<T>>): void;
    addEdge(vertex1: Vertex<T>, vertex2: Vertex<T>): void;
    getEdgesForVertex(vertex: Vertex<T>): Edge<T>[];
    hasVertex(vertex: Vertex<T>): boolean;
    hasEdge(vertex1: Vertex<T>, vertex2: Vertex<T>): boolean;
    getVertices(): Array<T>;
    getEdges(): Array<Edge<T>>;
}

export type Vertex<T> = T;
export type Edge<T> = [Vertex<T>, Vertex<T>];

export function getOtherVertex<T>(vertex: Vertex<T>, edge: Edge<T>) {
  let otherVertex: Vertex<T> = null;

  if (edge[0] === vertex) {
    otherVertex = edge[1];
  } else if (edge[1] === vertex) {
    otherVertex = edge[0];
  }

  return otherVertex;
}

export function equalEdges<T>(edge1: Edge<T>, edge2: Edge<T>) {
  return (edge1[0] === edge2[0] && edge1[1] === edge2[1]) || (edge1[0] === edge2[1] && edge1[1] === edge2[0]);
}

export class UndirectedGraph<T> implements Graph<T> {
  private vertices = new Array<T>();
  private edges = new Array<Array<Edge<T>>>();

  public addVertex(vertex: Vertex<T>, edges: Array<Edge<T>> = []): void {
    this.checkCorrectEdges(vertex, edges);

    this.vertices.push(vertex);
    this.edges.push([]);
    for (const edge of edges) {
      this.addEdge(edge[0], edge[1]);
      this.addEdge(edge[1], edge[0]);
    }
  }

  public addEdge(vertex1: Vertex<T>, vertex2: Vertex<T>): void {
    this.checkVertex(vertex1);
    this.checkVertex(vertex2);

    const edge1: Edge<T> = [vertex1, vertex2];
    const edge2: Edge<T> = [vertex2, vertex1];

    this.getEdgesForVertex(vertex1).push(edge1);
    this.getEdgesForVertex(vertex2).push(edge2);
  }

  public getEdgesForVertex(vertex: Vertex<T>): Edge<T>[] {
    const index = this.vertices.indexOf(vertex);

    if (index === -1) {
      return [];
    }

    return this.edges[index];
  }

  public hasVertex(vertex: Vertex<T>): boolean {
    return this.vertices.indexOf(vertex) !== -1;
  }

  public hasEdge(vertex1: Vertex<T>, vertex2: Vertex<T>): boolean {
    if (!this.hasVertex(vertex1) || !this.hasVertex(vertex2)) {
      return false;
    }

    for (const edge of this.getEdgesForVertex(vertex1)) {
      if (edge[1] === vertex2) {
        return true;
      }
    }

    return false;
  }

  public getVertices(): T[] {
    return this.vertices;
  }

  public getEdges(): Edge<T>[] {
    const allEdges: Edge<T>[] = [];
    const alreadyAddedVertices: Vertex<T>[] = [];

    for (let i = 0; i < this.edges.length; i++) {
      const it = this.edges[i].entries();
      let res = it.next();

      while (!res.done) {
        const [, edge] = res.value;
        if (alreadyAddedVertices.indexOf(edge[1]) === -1) {
          allEdges.push(edge);
        }

        res = it.next();
      }
      alreadyAddedVertices.push(this.vertices[i]);
    }

    return allEdges;
  }

  private checkCorrectEdges(vertex: Vertex<T>, edges: Array<Edge<T>>): void {
    for (const edge of edges) {
      const otherVertex: Vertex<T> = getOtherVertex(vertex, edge);

      if (otherVertex === null) {
        throw new Error(`Edge (${ edge[0] }, ${ edge[1] }) does not have vertex ${ vertex }`);
      }

      this.checkVertex(otherVertex);
    }
  }

  private checkVertex(vertex: Vertex<T>): void {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Graph does not have vertex ${ vertex }`);
    }
  }
}
