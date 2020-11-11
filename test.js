const daysOff = [];

const initiateDaysOff = (date, uid) => {
  let limit = new Date('2021-12-31').getTime();
  let startDate = new Date(`${date}`).getTime();
  let endDate = startDate + 3 * 86400000;
  do {
    daysOff.push({
      userId: uid,
      startDate: new Date(startDate).toISOString().substr(0, 10),
      endDate: new Date(endDate).toISOString().substr(0, 10)
    });
    startDate = new Date(endDate).getTime();
    startDate = startDate + 5 * 86400000;
    endDate = startDate + 3 * 86400000;
  } while (startDate <= limit);

  console.log(daysOff, daysOff.length);
};

initiateDaysOff('2021-01-02', 124430);
