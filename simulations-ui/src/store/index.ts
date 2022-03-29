import { createStore } from 'vuex';
import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';

interface State {
  graph: Graph;
}

export default createStore<State>({
  state() {
    return {
      graph: {} as Graph
    };
  },
  mutations: {
    setGraph(state, graph) {
      state.graph = graph;
    }
  },
  actions: {
    changeGraph(context, graph) {
      if (!graph.getAttribute('predefinedPositions')) {
        const sensibleSettings = forceAtlas2.inferSettings(graph);
        const fa2Layout = new FA2LayoutSupervisor(graph, {
          settings: sensibleSettings
        });
        fa2Layout.start();
        setTimeout(() => fa2Layout.stop(), 5000);
      }
      context.commit('setGraph', graph);
    }
  },
  modules: {}
});
