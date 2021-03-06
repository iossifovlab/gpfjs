import {
  UndirectedGraph, Graph, getOtherVertex, equalEdges, Edge, Vertex
} from '../utils/undirected-graph';

import {
  hasIntersection, intersection, equal, isSubset
} from '../utils/sets-helper';

export class Interval {
  constructor(
    public left = 0,
    public right = 1
  ) {}
}

export class IntervalForVertex<T> extends Interval {

  constructor(
    public vertex: Vertex<T>,
    left = 0,
    right = 1
  ) {
    super(left, right);
  }

  copy() {
    return new IntervalForVertex<T>(
      this.vertex,
      this.left,
      this.right
    );
  }

  toString() {
      return `i[${this.vertex}> ${this.left}:${this.right}]`;
  }
}

export class Realization<T> {
  constructor(
    public graph: Graph<T>,
    public forbiddenGraph: Graph<T>,
    public intervals: Array<IntervalForVertex<T>> = new Array<IntervalForVertex<T>>(),
    public domain: Array<Vertex<T>> = new Array<Vertex<T>>(),
    public maxWidth = 3,
  ) {}

  toString() {
    let orderedDomain = this.domain.map(v => v.toString()).sort((a, b) => a.localeCompare(b));
    return orderedDomain.join(';');
  }

  clone() {
    return new Realization(
      this.graph,
      this.forbiddenGraph,
      this.intervals.map(i => i.copy()),
      this.domain.slice(0)
    );
  }

  extend(vertex: Vertex<T>) {
    if (!this.canExtend(vertex)) {
      return false;
    }

    let maxRight = Math.max(...Array.from(this.maximalSet())
      .map(v => this.getInterval(v).right));

    let p = 0.5 + maxRight;

    for (let activeVertex of this.getActiveVertices()) {
      let activeInterval = this.getInterval(activeVertex);
      activeInterval.right = p + 1;
    }

    let newInterval = new IntervalForVertex(vertex, p, p + 1);
    this.domain.push(vertex);
    this.intervals.push(newInterval);

    // maybe add edge to graph?

    return true;
  }

  canExtend(newVertex: Vertex<T>) {
    let tempRealization = new Realization(
      this.graph,
      this.forbiddenGraph,
      this.intervals.concat([new IntervalForVertex(newVertex)]), // dummy interval
      this.domain.concat([newVertex]));

    let newActiveVertices = tempRealization.getActiveVertices();
    if (newActiveVertices.length >= tempRealization.maxWidth) {
      return false;
    }

    // console.log("Checking forbidden");
    let thisActiveVertices = this.getActiveVertices();
    let forbiddenEdges = this.forbiddenGraph.getEdgesForVertex(newVertex);
    for (let activeVertex of thisActiveVertices) {
      if (forbiddenEdges.some(edge => getOtherVertex(newVertex, edge) === activeVertex)) {
        return false;
      }
    }

    // console.log("Checking expected dangling");
    for (let activeVertex of this.getActiveVertices()) {
      let thisDangling = this.dangling(activeVertex);
      let otherDangling = tempRealization.dangling(activeVertex);
      let newEdge: Edge<T> = [activeVertex, newVertex];

      for (let thisEdge of thisDangling) {
        let expectedNewDangling = otherDangling.concat([newEdge]);
        if (!expectedNewDangling.some(edge => equalEdges(edge, thisEdge))) {
          return false;
        }
      }
    }

    // console.log("Checking new vertex dangling");
    let newDangling = tempRealization.dangling(newVertex);
    let newVertexEdges = this.graph.getEdgesForVertex(newVertex);
    for (let danglingEdge of newDangling) {
      if (!newVertexEdges.some(
          edge => equalEdges(edge, danglingEdge) ||
                  (this.domain.indexOf(getOtherVertex(newVertex, edge)) === -1))
          ) {
        return false;
      }
    }

    // console.log("Checking active");
    let activeVerticesNonEmptyDanglingAndNew =
      thisActiveVertices.filter(v => tempRealization.dangling(v).length !== 0)
      .concat([newVertex]);
    for (let newActiveVertex of newActiveVertices) {
      if (activeVerticesNonEmptyDanglingAndNew.indexOf(newActiveVertex) === -1) {
        return false;
      }
    }

    // console.log("Can extend :)");
    return true;
  }

  isEquivalent(other: Realization<T>) {
    if (!equal(new Set(this.domain), new Set(other.domain))) {
      return false;
    }
    if (!equal(new Set(this.getActiveVertices()),
               new Set(other.getActiveVertices()))) {
      return false;
    }

    for (let activeVertex of Array.from(this.getActiveVertices())) {
      if (!equal(new Set(this.dangling(activeVertex)),
                 new Set(other.dangling(activeVertex)))) {
        return false;
      }
    }

    return true;
  }

  getActiveVertexEdges(vertex: Vertex<T>) {
    return this.graph.getEdgesForVertex(vertex).filter(edge => {
      let otherVertex = edge[1];
      return this.domain.indexOf(otherVertex) === -1;
    });
  }

  getActiveVertexEdge(vertex: Vertex<T>) {
    return this.graph.getEdgesForVertex(vertex).find(edge => {
      let otherVertex = edge[1];
      return otherVertex && this.domain.indexOf(otherVertex) === -1;
    });
  }

  isActiveVertex(vertex: Vertex<T>) {
    return !!this.getActiveVertexEdge(vertex);
  }

  getActiveVertices() {
    let result = new Array<Vertex<T>>();
    for (let vertex of this.domain) {

      if (this.isActiveVertex(vertex) && result.indexOf(vertex) === -1) {
        result.push(vertex);
      }
    }

    return result;
  }

  dangling(vertex: Vertex<T>) {
    return this.getActiveVertexEdges(vertex);
  }

  maximalSet() {
    let result = new Set<Vertex<T>>();

    for (let vertex of this.domain) {
      if (this.isMaximal(vertex)) {
        result.add(vertex);
      }
    }

    return result;
  }

  isMaximal(vertex: Vertex<T>) {
    for (let domainVertex of this.domain) {
      if (domainVertex !== vertex && this.isInIntervalOrder(vertex, domainVertex)) {
        return false;
      }
    }
    return true;
  }

  isLayout() {
    if (this.domain.length === 0) {
      return false;
    }

    let activeVertices = this.getActiveVertices();
    for (let vertex of activeVertices) {
      if (!this.isMaximal(vertex)) {
        return false;
      }
    }

    return true;
  }

  isMaximum(vertex: Vertex<T>) {
    let interval = this.getInterval(vertex);
    if (!interval) {
      return false;
    }


    for (let domainInterval of this.intervals) {
      if (interval.left < domainInterval.left) {
        return false;
      }
    }

    return true;
  }

  isInIntervalOrder(a: Vertex<T>, b: Vertex<T>) {
    let intervalA = this.getInterval(a);
    let intervalB = this.getInterval(b);

    if (intervalA === null || intervalB === null) {
      return false;
    }

    return intervalA.right < intervalB.left;
  }

  private getInterval(vertex: T) {
    let index = this.domain.indexOf(vertex);
    if (index === -1) {
      return null;
    }
    return this.intervals[index];
  }
}

export class SandwichInstance<T> {
  constructor(
    public vertices: Array<Vertex<T>>,
    public required: Set<Edge<T>>,
    public forbidden: Set<Edge<T>>
  ) {}
}

export function solveSandwich<T>(sandwichInstance: SandwichInstance<T>) {
  let requiredGraph = new UndirectedGraph<T>();
  let forbiddenGraph = new UndirectedGraph<T>();

  for (let vertex of sandwichInstance.vertices) {
    requiredGraph.addVertex(vertex);
    forbiddenGraph.addVertex(vertex);
  }

  for (let edge of Array.from(sandwichInstance.required)) {
    requiredGraph.addEdge(edge[0], edge[1]);
  }

  for (let edge of Array.from(sandwichInstance.forbidden)) {
    forbiddenGraph.addEdge(edge[0], edge[1]);
  }

  let start = Date.now();
  let lexicalSort = (a: {}, b: {}) => a.toString().localeCompare(b.toString());

  let realizationsQueue = new Array<Realization<T>>();

  for (let vertex of sandwichInstance.vertices) {
    realizationsQueue.push(
      new Realization(requiredGraph, forbiddenGraph,
                      [new IntervalForVertex(vertex)], [vertex])
    );
  }
  realizationsQueue = realizationsQueue.sort(lexicalSort);

  let visitedRealizationMap = {};
  let currentIteration = 0;

  while (realizationsQueue.length !== 0) {
    let currentRealization = realizationsQueue.pop();

    let leftVertices = sandwichInstance.vertices
      .filter(vertex => currentRealization.domain.indexOf(vertex) === -1);
    if (leftVertices.length === 0) {
      return currentRealization.intervals;
    }
    leftVertices = leftVertices.sort(lexicalSort);

    if (currentIteration === 1000) {
      console.warn('Premature termination on', currentIteration, 'iterations');
      return null;
    }


    for (let vertex of leftVertices) {
      let currentRealizationCopy = currentRealization.clone();
      let successfulExtension = currentRealizationCopy.extend(vertex);
      // console.log("Success?", successfulExtension);

      if (!successfulExtension) {
        continue;
      }

      if (sandwichInstance.vertices.length === currentRealizationCopy.domain.length) {
        // console.log("Took", Date.now() - start, "ms");
        // console.log(currentRealizationCopy.intervals.map(i => i.toString()))
        return currentRealizationCopy.intervals;
      } else {
        // console.log("Checking realization", currentRealizationCopy);
        let realizationString = currentRealizationCopy.toString();
        if (!visitedRealizationMap[realizationString]) {
          realizationsQueue.push(currentRealizationCopy);
          visitedRealizationMap[realizationString] = true;
        }
      }
    }
  }

  return null;
}
