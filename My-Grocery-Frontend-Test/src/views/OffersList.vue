<template>
  <el-carousel
    :interval="4000"
    type="card"
    height="440px"
    style="overflow-x: auto; margin-bottom: 20px"
  >
    <el-carousel-item class="offer-page" v-for="item in items" :key="item.id">
      <div class="offer-item">
        <img :src="item.image" class="offer-item-image" />
        <div class="offer-item-content">
          <h3 class="offer-item-title">{{ item.title }}</h3>
          <p class="offer-item-description">{{ item.description }}</p>
          <div class="offer-item-details">
            <h4 class="offer-item-price">{{ item.price }}</h4>
            <h5 class="offer-item-offer">{{ item.offer }}</h5>
          </div>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          id: 1,
          title: "Pizza",
          description: "Delicious pizza topped with cheese and pepperoni.",
          price: "$10",
          offer: "20% Off",
          image:
            "https://th.bing.com/th?id=OLC.yKDSEt/hxdwvXg480x360&rs=1&pid=ImgDetMain",
        },
        {
          id: 2,
          title: "Burger",
          description: "Juicy beef burger with lettuce, tomato, and cheese.",
          price: "$8",
          offer: "Buy One Get One Free",
          image:
            "https://th.bing.com/th?id=OIF.B%2fQ4bME2%2bVyKb7EwhTEW4Q&rs=1&pid=ImgDetMain",
        },
        {
          id: 3,
          title: "Sushi",
          description: "Fresh sushi rolls with salmon, avocado, and rice.",
          price: "$15",
          offer: "Special Offer: Get a free appetizer",
          image:
            "https://th.bing.com/th/id/OIP.Q1AzAEuZZzQ7jiBNO55LfQHaHa?rs=1&pid=ImgDetMain",
        },
      ],
      isLargeScreen: window.innerWidth >= 600, // Check screen width
    };
  },
  created() {
    // Update isLargeScreen on window resize
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    // Remove event listener to prevent memory leaks
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.isLargeScreen = window.innerWidth >= 600;
    },
  },
};
</script>

<style scoped>
.offer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.offer-item-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 20px;
}

.offer-item-content {
  text-align: center;
}

.offer-item-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.offer-item-description {
  font-size: 12px;
  margin-bottom: 10px;
}

.offer-item-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.offer-item-price {
  font-size: 12px;
  font-weight: bold;
}

.offer-item-offer {
  font-size: 12px;
  color: #2ecc71;
}
.offer-item {
  display: flex;
  flex-direction: column;
  background: darkcyan;
  border-radius: 8px;
  border: inset;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
}
@media screen and (max-width: 600px) {
  .offer-item-price {
    font-weight: bold;
    font-size: 10px;
  }
  .offer-item-offer {
    color: #2ecc71;
    font-size: 7px;
  }
  .offer-item-title {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .offer-item-description {
    font-size: 11px;
    margin-bottom: 10px;
  }

  .offer-item-image {
    width: 150px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 20px;
  }
}
</style>
