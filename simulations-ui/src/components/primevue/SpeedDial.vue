<script lang="js">
import SpeedDial from 'primevue/speeddial';

export default {
  name: 'SpeedDial',
  extends: SpeedDial,
  methods: {
    onItemClick(e, item) {
      if (item.command) {
        item.command({ originalEvent: e, item });
      }
      this.isItemClicked = true;
      e.preventDefault();
    }
  }
};
</script>
