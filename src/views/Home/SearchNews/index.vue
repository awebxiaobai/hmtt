<template>
  <div>
    <van-nav-bar
      :title="isSearchResults ? `${value} 的搜索结果` : '搜索中心'"
      left-arrow
      @click-left="
        () => {
          if (!isSearchResults) {
            value = '';
            suggestions = [];
            $router.back();
          } else {
            this.page = 1;
            searchResults = [];
            isSearchResults = false;
            finished = false;
            value = '';
            suggestions = [];
          }
        }
      "
    />

    <div v-if="!isSearchResults">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @input="onInput"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <div>
        <van-cell-group v-show="historys.length && !value">
          <van-cell title="历史记录" />
          <van-cell
            v-for="history in historys"
            :title="history"
            :key="history"
            @click="
              () => {
                value = history;
                onSearch();
              }
            "
          />
        </van-cell-group>
        <van-cell-group v-if="!(suggestions.length === 1 && !suggestions[0])">
          <van-cell
            v-for="(suggestion, index) in suggestions"
            :key="index"
            icon="search"
            @click="
              () => {
                value = suggestion;
                onSearch();
              }
            "
          >
            <template #title>
              <span
                v-html="$options.filters.getRedSuggestion(suggestion, value)"
              ></span>
              <!-- <span :v-html="suggestion | getRedSuggestion(value)"></span> -->
              <!-- <span>{{ suggestion | getRedSuggestion(value) }}</span> -->
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <div v-else>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in searchResults"
          :key="index"
          :title="item.title"
          @click="
            () => {
              $router.push({
                path: '/layout/home/detail',
                query: {
                  article_id: item.art_id,
                },
              });
            }
          "
        />
      </van-list>
    </div>
  </div>
</template>

<script>
import { reqGetSearchResults, reqGetSuggestions } from "../../../api";
export default {
  name: "SearchNews",
  data() {
    return {
      value: "",
      searchResults: [],
      suggestions: [],
      historys: JSON.parse(localStorage.getItem("searchHistory")) || [],
      loading: false,
      finished: false,
      isSearchResults: false,
      list: [],
      page: 1,
    };
  },
  methods: {
    async onSearch() {
      if (!this.value.trim()) return;
      this.isSearchResults = true;
      if (this.historys.indexOf(this.value) !== -1) {
        this.historys.splice(this.historys.indexOf(this.value), 1);
      }
      this.historys.unshift(this.value);
      localStorage.setItem("searchHistory", JSON.stringify(this.historys));
    },
    onInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (!this.value.trim()) {
          this.suggestions = [];
          return;
        }
        let suggestionsData = await reqGetSuggestions({ q: this.value });
        this.suggestions = suggestionsData.data.options;
        console.log(this.suggestions);
      }, 300);
    },
    async onLoad() {
      let searchResultData = await reqGetSearchResults({
        page: this.page++,
        q: this.value,
      });
      this.searchResults.push(...searchResultData.data.results);

      this.loading = false;

      if (this.searchResults.length >= 90) {
        this.finished = true;
      }
    },
  },
  filters: {
    getRedSuggestion(suggestion, value) {
      suggestion = suggestion.toLowerCase();
      value = value.toLowerCase();
      let arr = suggestion.split(value);
      let redSuggestion = "";
      arr.forEach((v, i) => {
        redSuggestion += v;
        if (i !== arr.length - 1) {
          redSuggestion += `<span style="color:#f00;">${value}</span>`;
        }
      });
      console.log(redSuggestion);
      return redSuggestion;
    },
  },
  mounted() {
    console.log(this);
  },
};
</script>

<style scoped lang="less">
::v-deep .van-nav-bar__arrow {
  color: #fff !important;
}
</style>