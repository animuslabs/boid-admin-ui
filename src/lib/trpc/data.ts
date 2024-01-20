import { DoubleYChartOptions } from "./interfaces"
import { useApiStore } from "src/stores/apiStore"
import { computed } from "vue"

const apiStore = useApiStore()
const trpcClient = computed(() => apiStore.trpcClient)


export const fetchGetDeltasBoidIDData = (
  boid_id:string,
  from:string,
  to:string
) => trpcClient.value.GetDeltasBoidID.query({ boid_id, from, to })
export const boidIDstakePowerOptions:DoubleYChartOptions = {
  colors: ["#004573", "#47EEB2", "#33B3E6", "#F04A68"], // darker blue, green
  chart: {
    id: "basic-line",
    stacked: false,
    toolbar: {
      show: false
    }
  },
  title: {
    text: "Boid ID Stake & Power",
    align: "center"
  },
  xaxis: {
    categories: [],
    labels: {
      rotate: -45, // Rotate labels by -45 degrees
      trim: true // Trim longer labels
    },
    tickAmount: 10,
    title: {
      text: "Date",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#000000"
      }
    }
  },
  yaxis: [
    {
      labels: {
        formatter: (value:number) => {
          return Number(value.toFixed(2))
        },
        style: {
          colors: "#004573"
        }
      },
      title: {
        text: "Self Staked, Balance, Received Delegated Stake",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#004573"
        }
      }
    },
    {
      opposite: true,
      title: {
        text: "Power",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#47EEB2"
        }
      },
      labels: {
        formatter: (value:number) => {
          return Number(value.toFixed(2))
        },
        style: {
          colors: "#47EEB2"
        }
      }
    }
  ],
  stroke: {
    width: 2,
    curve: "smooth"
  },
  fill: {
    type: "solid",
    opacity: 1
  }
}

export const fetchGetCombinedData = (
  boid_id:string,
  from:string,
  to:string
) => trpcClient.value.GetCombinedData.query({ boid_id, from, to })
export const combinedDataOptions:DoubleYChartOptions = {
  colors: ["#004573", "#47EEB2", "#33B3E6", "#F04A68"], // darker blue, orange, yellow, green
  chart: {
    id: "basic-line",
    stacked: false,
    toolbar: {
      show: false
    }
  },
  title: {
    text: "BoidID Data with Folding@Home",
    align: "center"
  },
  xaxis: {
    categories: [],
    labels: {
      rotate: -45, // Rotate labels by -45 degrees
      trim: true // Trim longer labels
    },
    tickAmount: 10,
    title: {
      text: "Date",
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#000000"
      }
    }
  },
  yaxis: [
    {
      labels: {
        formatter: (value:number) => {
          return Number(value.toFixed(2))
        },
        style: {
          colors: "#004573"
        }
      },
      title: {
        text: "Power",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#004573"
        }
      }
    },
    {
      labels: {
        formatter: (value:number) => {
          return Number(value.toFixed(2))
        },
        style: {
          colors: "#47EEB2"
        }
      },
      title: {
        text: "Staked",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#47EEB2"
        }
      }
    },
    {
      opposite: true,
      title: {
        text: "Balance",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#33B3E6"
        }
      },
      labels: {
        formatter: (value:number) => {
          return Number(value.toFixed(2))
        },
        style: {
          colors: "#33B3E6"
        }
      }
    },
    {
      opposite: true,
      title: {
        text: "Folding@Home Points",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#F04A68"
        }
      },
      labels: {
        formatter: (value:number) => {
          return Number(value.toFixed(2))
        },
        style: {
          colors: "#F04A68"
        }
      }
    }
  ],
  stroke: {
    width: 1,
    curve: "smooth"
  },
  fill: {
    type: "solid",
    opacity: 1
  }
}

export const fetchGetLogPwrClaimData = (
  boid_id:string,
  from:string,
  to:string
) => trpcClient.value.GetLogPwrClaim.query({ boid_id, from, to })
export const logPwrClaimOptions:DoubleYChartOptions = {
  colors: ["#004573", "#47EEB2", "#33B3E6", "#F04A68", "#0000FF", "#FF4500", "#32CD32", "#8A2BE2", "#A52A2A", "#DEB887"],
  chart: {
    id: "basic-bar",
    stacked: false,
    toolbar: {
      show: false
    }
  },
  title: {
    text: "BoidID Power Data (logpwrclaim)",
    align: "center"
  },
  xaxis: {
    categories: [],
    labels: {
      rotate: -45,
      trim: true
    },
    tickAmount: 10,
    title: {
      text: "Date",
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#000000"
      }
    }
  },
  yaxis: [
    {
      labels: {
        formatter: (value:number) => {
          return isFinite(value) ? Number(value.toFixed(2)) : 0
        },
        style: {
          colors: "#004573"
        }
      },
      title: {
        text: "Power Change",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#004573"
        }
      }
    },
    {
      opposite: true,
      labels: {
        formatter: (value:number) => {
          return isFinite(value) ? Number(value) : 0
        },
        style: {
          colors: "#F04A68"
        }
      },
      title: {
        text: "Mint Metrics",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#F04A68"
        }
      }
    }
  ],
  stroke: {
    width: 1,
    curve: "smooth"
  },
  fill: {
    type: "solid",
    opacity: 0.6
  }
}

export const mintedBoidIDOptions:DoubleYChartOptions = {
  colors: ["#004573", "#47EEB2", "#33B3E6", "#F04A68", "#0000FF", "#FF4500", "#32CD32", "#8A2BE2", "#A52A2A", "#DEB887"],
  chart: {
    id: "bar",
    stacked: true,
    toolbar: {
      show: false
    }
  },
  title: {
    text: "Total Minted Boid ID distribution",
    align: "center"
  },
  xaxis: {
    categories: [],
    labels: {
      rotate: -45,
      trim: true
    },
    tickAmount: 10,
    title: {
      text: "Date",
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#000000"
      }
    }
  },
  yaxis: [
    {
      labels: {
        formatter: (value:number) => {
          return isFinite(value) ? Number(value.toFixed(2)) : 0
        },
        style: {
          colors: "#004573"
        }
      },
      title: {
        text: "Minted BOID",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#004573"
        }
      }
    }
  ],
  stroke: {
    width: 0,
    curve: "smooth"
  },
  fill: {
    type: "solid",
    opacity: 1
  }
}
