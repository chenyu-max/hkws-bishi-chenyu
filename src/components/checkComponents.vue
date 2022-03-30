<template>
  <div class="check-components-container">
    <div class="left-container">
      <div class="title">
        监控点所在区域
      </div>
      <a-tree
          :auto-expand-parent="autoExpandParent"
          :replace-fields="replaceCityFields"
          :expanded-keys="expandedKeys"
          :tree-data="allCity"
          @expand="onExpand"
          @select="onSelect"
      />
    </div>
    <div class="middle-container" v-if="monitorData">
      <middleTree ref="middleTree" :monitorData="monitorData" :id="selectedKeys" :selectId="selectId"
                  @changeKeys="onChangeKeys"
                  @changeSelectMonitors="onChangeSelectMonitors"></middleTree>
    </div>
    <div class="right-container" v-if="monitorData">
      <rightTree :selectMonitors="selectMonitors" @cancelSelect="onCancelSelect"></rightTree>
    </div>
  </div>
</template>

<script>
import api from '../api/data';
import middleTree from "./components/middleTree.vue";
import rightTree from "./components/rightTree.vue";

export default {
  name: "checkComponents",
  async created() {
    await this._getTreeData();
    // 设置默认值
    this.selectedKeys = this.allCity[0].id;
    this.expandedKeys = [this.allCity[0].id];
    await this._getMonitorData({
      pageNo: 1,
      pageSize: 10,
      id: this.selectedKeys,
      isContain: true
    });
  },
  components: {
    middleTree,
    rightTree,
  },
  data() {
    return {
      replaceCityFields: {
        title: 'name',
        key: 'id',
      },
      autoExpandParent: true,
      expandedKeys: [],
      selectedKeys: null,
      allCity: null,
      monitorData: null,
      checkedKeys: null,
      selectId: {},
      selectMonitors: [],
    }
  },
  methods: {
    async _getTreeData() {
      await api.getTreeData().then((res) => {
        this.allCity = res;
      })
    },
    async _getMonitorData(params) {
      await api.getMonitorData(params).then((res) => {
        this.monitorData = res;
      })
    },
    async onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys[0];
      if (this.selectedKeys) {
        await this._getMonitorData({
          pageNo: 1,
          pageSize: 10,
          id: this.selectedKeys,
          isContain: true
        })
      }
    },
    onChangeKeys(checkedKeys, deleteId) {
      this.selectId[checkedKeys.id] = checkedKeys.checkedKeys;
      let obj = {
        ...this.selectId,
      }
      let res = {};
      for (let key in obj) {
        let arr = obj[key];
        let index = arr.indexOf(deleteId);
        if (index > -1) {
          arr.splice(index, 1);
        }
        res[key] = arr;
      }
      this.selectId = res;
    },
    onCancelSelect(deleteId) {
      let obj = {
        ...this.selectId,
      }
      if (deleteId.length) {
        let res = {};
        for (let id of deleteId) {
          for (let key in obj) {
            let arr = obj[key];
            let index = arr.indexOf(id);
            if (index > -1) {
              arr.splice(index, 1);
            }
            res[key] = arr;
          }
        }
        this.selectId = res;
        let obj2 = {...this.selectMonitors};
        let res2 = {};
        for (let id of deleteId) {
          for (let key in obj2) {
            let arr = obj2[key];
            let index = -1;
            arr.forEach((item, inx) => {
              if (item.id === id) {
                index = inx;
              }
            })
            if (index > -1) {
              arr.splice(index, 1);
            }
            res2[key] = arr;
          }
        }
        this.selectMonitors = res2;
        this.$refs.middleTree.fun();
      }
    },
    onChangeSelectMonitors(selectMonitors) {
      this.selectMonitors = {
        ...this.selectMonitors,
        [selectMonitors.id]: selectMonitors.selectMonitors,
      };
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
  }
}
</script>

<style scoped>
.check-components-container {
  width: 80%;
  height: 80%;
  /*background-color: #f00;*/
  border-radius: 2rem;
  box-shadow: 0 0 10px 2px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.check-components-container > div {
  /*flex: 1;*/
  width: 30%;
  height: 90%;
  border: 1px solid;
}

.left-container .title {
  width: 100%;
  text-align: center;
  height: 2rem;
  border-bottom: 1px solid;
  line-height: 2rem;
}

/deep/ .ant-checkbox-group-item {
  display: block;
  padding: 1rem;
}
</style>
