<template>
  <div>
    <h2>{{ headline }}</h2>
    <button @click="clickButton">Show the msg property!</button>
    <button @click="doAxiosRequest">Load random dog image</button>
    <br />
    <img :src="dogImage" width="200" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      headline: "Vue Main Component Headline",
      dogImage: undefined,
    };
  },
  props: {
    msg: String,
  },
  methods: {
    clickButton: function () {
      alert("msg property: " + this.msg);
    },
    // doAxiosRequest: function () {
    //   axios.get("https://dog.ceo/api/breeds/image/random").then((response) => {
    //     this.dogImage = response.data.message;
    //   });
    // },
  },
  mounted() {
    // disabled: annoying on page embed
    // alert("Vue Main Component mounted");
  },
};
</script>
