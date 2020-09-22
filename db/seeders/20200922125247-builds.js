"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "builds",
      [
        {
          id: "a197ee1c-9b02-4824-bd5f-3725073fc772",
          name: "Single Lane Balancer",
          owner_id: "c8b15803-1b90-4194-9896-a2869e67deb2",
          blueprint:
            "0eNrllkFvgyAYhv9Kw1kXsK22HnfuaddlabD91pEpGMCmTeN/H2gbzUqnctmSnQwf8vDy+vHGC8ryCkrJuN5mQnyi9NJVFEpfe0M7x3aCt2XFDpzmtqbPJaAUMQ0FChCnhR3BqZSgVKgl5aoUUocZ5BrVAWJ8DyeUkjoYDVFlzrQG2Vse1W8BAq6ZZtAKagbnLa+KzLyZkiEpASqFMssFt/sbZGiWnM0jMrvsmYRdOxdZod/g0WQ4vrEdtPkdrTKHlAcpzPNnsdhovVonKl1W1uE7/uKxofdc/LRspRKX1KWHVDxeaTzZ186G3ieLHejE32TSSWf8gfLVBI9vFjubYe3ZWmTYAoI97TWtYG5bczfTXh4EKKdmmamR2YZymD3TnPIdyHAD73b6CFI1rGSOyTqOyDyJuyuMrcR/ky7ucIl/IVxG5iAejsGFR9P/kVwZxk8I2MTXY6cXK5+4HpklY489JvI84sQZVdHEcHlhh4/hdCEuatj84/TRuUVnV7QyU9SoOsL2llEPtqm/ACpbH24=",
          json: JSON.stringify(require("./bp2.json")),
          metadata: JSON.stringify({
            type: "balancer",
            state: "late_game",
            tileable: false,
            area: 43,
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "a84e9b6c-c920-4567-9ba0-2a018d734da7",
          name: "16 - 8 Belt Balancer",
          owner_id: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
          blueprint:
            "0eNqlmt1uo0AMhV8lmmuoZjx/hMu+xqpapS2qkFKCgKxaRbz7kr9ulQzFPnsVJRGfJx6fg8fkoJ63+6rt6mZQ5UHVL7umV+Wvg+rrt2azPX42fLaVKlU9VO8qU83m/fiu+mi7qu/zvt3Ww1B1asxU3bxWH6o0Y8a+fOg2Td/uuiF/rrbDNwiNT5mqmqEe6uq8oNObz9/N/v15CleaJVam2l0/Xb5rjqv4OF3xqco8TkFe6656OX/ljqu9YZOYTUl2SLDtfArvqPZMDQ9+mesEXHdZLYfrxbnIL3gGPMjhxIZHQUbyS6odJyWFfNWGveq1GK7ZbKPRwvbLojEGhQcG/F6S+8kourduN73+LPhbfPZlSU27P3rOfTQrF5PnVI5xsJosg45r1THoQaKny9ZaVlYQpRKLXKBqcmMKB4vTpnCkgaK+Wsntjn1V9W4/zJQ1mf+IZ4F48H2UUY5kcUeYzd2sI5ADotFC5uajeXmTwNIDBbmxsSRMEbYeYtALuE/g0Ncw3Szfuaz8nnu1uBs6pegGdSRKOZIluLVhJNpKbqu5fvDXNKRYkn7X/EMt75dHTYsY8ICbFs21MfMGbKNc7oYjd1ugcjcMOKxHBtxpFK6Xt9cZeSPDyrdD2t9LgOO6FyvFIXdTLeA71Fh0Sv3Oo7ikmbgA/3ojb4tcBEcXDPdyBcjmVPca7oG0+AjmNRzMiPstb8T9Fku2nsT+q1lci9ov4xTp4TMqowXwXu6QrAbUA6dTVsvsI+wNdmSUHjxM4mzlGj/wkdzYAjpessvmE9B5r11uogOBbEbHFyzsYyT2sSAfArM0EODBEuMgHwLe23iGwgIi4ItDAEOWAAvap1qTgI6ckrSokRNYchYW0XEvoyQiwaLx8lNSxCdJ8kFSdHAwLy/G6IFo9udo8z9NPlxiPW6JEZ2ghGThFrgfBGAL1qgfJFdfaBQXkzh0fsR40lmgt1UO24Luw2E7kB0YbA/LP4gFWcgfr1p2kuSjpcRj7Kfs/L+A8tu/EDK13UyLmz4zYZWvitXjtNLV42a7aV5O8D9V15+vLyJRYdY60jj+BcYaEMs=",
          json: JSON.stringify(require("./bp1.json")),
          metadata: JSON.stringify({
            type: "balancer",
            state: "late_game",
            tileable: true,
            area: 265,
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("builds", null, {})
  },
}
