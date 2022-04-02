import { createStore } from 'vuex';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import { Graph } from '@/helpers/types';

interface State {
  graph: Graph;
}

export default createStore<State>({
  state() {
    return {
      graph: new Graph()
    };
  },
  mutations: {
    setGraph(state, graph) {
      state.graph = graph;
    }
  },
  actions: {
    changeGraph(context, graph: Graph) {
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
