<template>
  <div class="right-tree-container">
    <div class="title">
      已选择监控点
    </div>
    <div class="tree-container">
      <a-tree
          v-model="checkedKeys"
          checkable
          :expanded-keys="expandedKeys"
          :tree-data="list"
          :replace-fields="replaceFields"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "rightTree",
  props: {
    selectMonitors: Object,
  },
  created() {
    this.expandedKeys = [];
  },
  watch: {
    selectMonitors: {
      handler() {
        let temp = [];
        for (let key in this.selectMonitors) {
          temp = [...temp, ...this.selectMonitors[key]];
        }
        const deWeightThree = () => {
          let map = new Map();
          for (let item of temp) {
            if (!map.has(item.id)) {
              map.set(item.id, item);
            }
          }
          return [...map.values()];
        }
        temp = deWeightThree();
        this.list = [{
          id: 'all',
          name: '监控点名称',
          children: [...temp],
        }];
        this.checkedKeys = temp.map((item) => item.id);
        this.expandedKeys = ['all'];
        // this.list = [...temp];
      },
      deep: true,
    },
    checkedKeys: {
      handler(newVal, oldVal) {
        let deleteId = [];
        const someArr = [...new Set([...oldVal].filter(x => newVal.indexOf(x) > -1))];
        oldVal.map((item) => {
          if (someArr.indexOf(item) === -1) {
            deleteId.push(item);
          }
        });
        this.$emit('cancelSelect', deleteId);
      },
      deep: true,
    }
  },
  data() {
    return {
      expandedKeys: [],
      checkedKeys: [],
      replaceFields: {
        title: 'name',
        key: 'id',
      },
      list: null,
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.title {
  width: 100%;
  height: 2rem;
  border-bottom: 1px solid;
  text-align: center;
  line-height: 2rem;
}

.right-tree-container {
  height: 100%;
}

.tree-container {
  height: calc(100% - 2rem);
  overflow-y: scroll;
}
</style>
