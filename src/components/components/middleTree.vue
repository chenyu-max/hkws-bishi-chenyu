<template>
  <div class="middle-tree-container">
    <div class="title-container">
      <span>带选择监控点</span>
      <a-checkbox v-model="isContain" @change="onChange">
        是否包含下级组织
      </a-checkbox>
    </div>
    <div class="tree">
      <a-tree
          v-model="checkedKeys"
          checkable
          :expanded-keys="expandedKeys"
          :replace-fields="replaceFields"
          :tree-data="monitorList"
      />
    </div>
    <div class="pagination-container" v-if="Math.ceil(page.total / page.pageSize) !== 1">
      <a-pagination size="small" v-model="page.pageNo" :total="page.total" show-less-items/>
    </div>
  </div>
</template>

<script>
import api from "@/api/data";

export default {
  name: "middleTree",
  props: {
    monitorData: Object,
    id: String,
    selectId: Object,
  },
  created() {
    this.page.pageSize = this.monitorData.pageSize;
    this.page.pageNo = this.monitorData.pageNo;
    this.page.total = this.monitorData.total;
    this.list = this.monitorData.list;
    this.expandedKeys = [`all-${this.id}-${this.page.pageNo}`];
  },
  data() {
    return {
      replaceFields: {
        title: 'name',
        key: 'id',
      },
      expandedKeys: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      list: null,
      isContain: true,
      checkedKeys: [],
      flag: false,
    }
  },
  watch: {
    id: async function () {
      this.flag = false;
      this.expandedKeys = [`all-${this.id}-${this.page.pageNo}`];
      this.isContain = true;
      this.page.pageNo = 1;
      await this._getMonitorData({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        id: this.id,
        isContain: this.isContain,
      })
      const nowAllIds = this.list.map((item) => item.id);
      let temp = [];
      for (let key in this.selectId) {
        temp = [...temp, ...this.selectId[key]];
      }
      temp = Array.from(new Set(temp));
      this.checkedKeys = temp.filter((id) => nowAllIds.indexOf(id) > -1);
    },
    page: {
      async handler() {
        this.flag = false;
        this.expandedKeys = [`all-${this.id}-${this.page.pageNo}`];
        await this._getMonitorData({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          id: this.id,
          isContain: this.isContain,
        })
        const nowAllIds = this.list.map((item) => item.id);
        let temp = [];
        for (let key in this.selectId) {
          temp = [...temp, ...this.selectId[key]];
        }
        temp = Array.from(new Set(temp));
        this.checkedKeys = temp.filter((id) => nowAllIds.indexOf(id) > -1);
      },
      deep: true,
    },
    checkedKeys: {
      handler(newVal, oldVal) {
        const selectMonitors = this.list.filter((item) => {
          return this.checkedKeys.indexOf(item.id) !== -1;
        });
        let deleteId = null;
        if (this.flag) {
          const someArr = [...new Set([...oldVal].filter(x => newVal.indexOf(x) > -1))];
          oldVal.map((item) => {
            if (someArr.indexOf(item) === -1) {
              deleteId = item;
            }
          });
        }
        this.flag = true;
        this.$emit('changeKeys', {
          id: `all-${this.id}-${this.page.pageNo}`,
          checkedKeys: this.checkedKeys.filter((id) => id.indexOf('all') === -1)
        }, deleteId);
        this.$emit('changeSelectMonitors', {
          id: `all-${this.id}-${this.page.pageNo}`,
          selectMonitors,
        });
      }
    },
  },
  computed: {
    monitorList: {
      get() {
        return [{
          name: '监控点名称',
          id: `all-${this.id}-${this.page.pageNo}`,
          children: [...this.list],
        }];
      },
    },
  },
  methods: {
    async _getMonitorData(params) {
      await api.getMonitorData(params).then((res) => {
        this.page.pageSize = res.pageSize;
        this.page.pageNo = res.pageNo;
        this.page.total = res.total;
        this.list = res.list;
      })
    },
    async onChange() {
      this.page.pageNo = 1;
      await this._getMonitorData({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        id: this.id,
        isContain: this.isContain,
      })
    },
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys;
    },
    fun(){
      const nowAllIds = this.list.map((item) => item.id);
      let temp = [];
      for (let key in this.selectId) {
        temp = [...temp, ...this.selectId[key]];
      }
      temp = Array.from(new Set(temp));
      this.checkedKeys = temp.filter((id) => nowAllIds.indexOf(id) > -1);
    },
  },
}
</script>

<style scoped>
.middle-tree-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title-container {
  flex: 0 0 2rem;
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: center;
  border-bottom: 1px solid;
}

.tree {
  flex: 1;
  padding: 0 1rem;
}

.pagination-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 0 0 auto;
  margin-bottom: 2rem;
}
</style>
