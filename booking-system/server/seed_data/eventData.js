const eventData = [
  {
    event_id: 1,
    title: "Group 1",
    start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    group_id: 1,
    color: "#FF5733",
    module: "EE4218"
  },
  {
    event_id: 2,
    title: "Group 1",
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    group_id: 1,
    color: "#FF5733",
    module: "EE4218"
  },
  {
    event_id: 3,
    title: "Group 2",
    start: new Date(new Date(new Date().setHours(15)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(17)).setMinutes(0)),
    group_id: 2,
    color: "#17A2B8",
    module: "EE2026"
  },
  {
    event_id: 4,
    title: "Group 2",
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
        new Date().getDate() + 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() + 2
      )
    ),
    group_id: 2,
    color: "#17A2B8",
    module: "EE4218"
  },
  {
    event_id: 5,
    title: "Group 3",
    start: new Date(
      new Date(new Date(new Date().setHours(12)).setMinutes(30)).setDate(
        new Date().getDate() + 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
        new Date().getDate() + 2
      )
    ),
    group_id: 3,
    color: "#FFC107",
    module: "EE2028"
  },
  {
    event_id: 6,
    title: "Group 3",
    start: new Date(
      new Date(new Date(new Date().setHours(21)).setMinutes(30)).setDate(
        new Date().getDate() + 4
      )
    ),
    end: new Date(new Date(new Date().setHours(22)).setMinutes(30)).setDate(
        new Date().getDate() + 4
    ),
    group_id: 3,
    color: "#FFC107",
    module: "EE4218"
  }
];

module.exports = eventData;
