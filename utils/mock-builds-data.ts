import { Build } from "../db/entities/build.entity"
import { EState, ECategory } from "../types"
import { mockedUsers } from "./mock-users-data"

export const mockedBuilds: Build[] = [
  {
    id: "1",
    description: "some dummy description",
    image: {
      src: "",
      width: 0,
      height: 0,
    },
    blueprint:
      "0eNqdmd1u4jAQhV+l8nVS+T8Jr7KqVtBGlSWaRMGpFqG8+yaNWmjLJHN8BRj8MXNsHw/DRRyOQ931oYlidxHhuW1OYvfnIk7htdkf57F47mqxE++hj8M0kolm/zYPLJ/ISzFmIjQv9T+xU2OWOFPfnRli/XadFvt9c+raPuaH+hhvJpvxKRN1E0MM9RL9x4vz32Z4O9T9FBfFyETXnqZpbTN/64TK1aPLxHl6Yh/dOAf1A6X5KL2BMldBumOIcRq7A1kQ5j7CsqORG8E4fl5bKM/IS66mVbCD2dK4ZJO2Fr5iZLW+WEqyg7EbwSj+jjZbKM1IzK4nZhIOhSZYNoGlCNZ1Uw+TU/SvfTs9bp78mZZ9WlA7xG6YzeY3nbPPc7WebYEfYCrZEkdRUVWIbhLUTUv8TBKBaoWjCPm0xj1nSfgl9PXz8ra/BzaAmN9OB0dLi/sAL2qHexWlrMdR1HoXgJYG1ZJ/gPKvQOVPMfU9coWTJVEz8A9Pbm5QmwtuFHLmDZ3/l9KhIYQ2KTUUpYdJKO1Yi2YsvzyjgnOwJfNC8wnFGo+ccB9RyeOlFy9EViH2SdzmWQlsfMXY97TD2ISqjVDXatxUKZSBURQJv41YS24dbnrEZWQ9jiIuI1vg1qM5VmxL3B+pGCscRSjnJJ4uhULuGnnDYpwxp2EHYy2KM7jn8sA2pdj+XcRxtHFwjcsqFp2HrZ4nTZFgzSvKkBWJKxNq9G9lJY2uYE9kae7xZgKPq2Au4T1eJxTrPFG9wV2c6F34hH6DYQmZ1HwwvPw9vzalmnRFggczoytTHI3JrtjNRSLxAm8/UF1KxYjFrBI0u6lIZYMXb1Qslt0HpGJxeIXgCJTHTyWFwn/SUKQSLwEoVAVvQoJUSvhOp0i481MkDd95H6SnbPnHZ3fzp1Qmjvtp6jRWPsT2oZwG3uv+tPxWKJUtbFX4Qknv/Dj+B1qDv3E=",
    name: "8x8 balancer",
    metadata: {
      state: EState.EARLY_GAME,
      categories: [ECategory.BALANCER],
      tileable: false,
      area: 0,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: mockedUsers[0],
  },
  {
    id: "2",
    description: "some dummy description",
    image: {
      src: "",
      width: 0,
      height: 0,
    },
    blueprint: "asdf",
    name: "1-4 train loading",
    metadata: {
      state: EState.MID_GAME,
      categories: [ECategory.BALANCER, ECategory.TRAINS],
      tileable: false,
      area: 0,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: mockedUsers[0],
  },
  {
    id: "3",
    description: "some dummy description",
    image: {
      src: "",
      width: 0,
      height: 0,
    },
    blueprint: "asdf",
    name: "tileable green circuit production",
    metadata: {
      state: EState.EARLY_GAME,
      categories: [ECategory.PRODUCTION],
      tileable: true,
      area: 0,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: mockedUsers[1],
  },
  {
    id: "4",
    description: "some dummy description",
    image: {
      src: "",
      width: 0,
      height: 0,
    },
    blueprint: "asdf",
    name: "beaconed green circuit production",
    metadata: {
      state: EState.LATE_GAME,
      categories: [ECategory.PRODUCTION],
      tileable: true,
      area: 0,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: mockedUsers[0],
  },
]
