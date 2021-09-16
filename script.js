const globTime = {
  config: {
    barWidth: 30,
    margin: {top: 40, right: 0, bottom: 0, left: 0},
    defaultGraph: "chrono",
    timeLineMargin: {top: 10, right: 0, bottom: 0, left: 0},
    timeLineSeparatorLength: 10,
    nameMargin: 1,
    tickCount: 6,
    graph: {
      strokeWeight: 6,
      circleRadius: 4,
      lineType: d3.curveCatmullRom,
      dashArray: "5,5"
    },
    scrollBarXHeight: 20,
    scrollBarYWidth: 20,
    headerHeight: 45,
    legendWidth: 270,
    patternRotation: 45,
    patternScale: 10,
    timeSumMargin: {top: 10, bottom: 20, font: 18}
  },
  storage: {
    firstLoad: true,
    configJson: undefined,
    unknownActivities: {},
    activityVisibility: {},
    multiLayerPref: {},
    data: undefined,
    dates: undefined,
    groups: [],
    activities: undefined,
    comments: undefined,
    commentFilter: [],
    months: undefined,
    activityColors: {},
    startTime: undefined,
    endTime: undefined
  }
}

async function groundMain(files) {
  let firstTime = true;
  let currentGraph = globTime.config.defaultGraph; // chrono or graph or sum
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
  let ttip = {};
  /* activityVisibility {activity: "hidden"/"visible"}
  for adjustment based on what is visible in the timeGraph.
  Same order as activities[] */
  const activityVisibility = globTime.storage.activityVisibility;
  // text length measurement
  const font = "12.8px Comfortaa";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;

  function verifyFiles(files) {
    let nameOne, nameTwo, typeOne, typeTwo, csvFile, configFile;
    nameOne = files[0].name;
    typeOne = nameOne.split(".");
    typeOne = typeOne[typeOne.length - 1];
    if (files.length == 2) {
      nameTwo = files[1].name;
      typeTwo = nameTwo.split(".");
      typeTwo = typeTwo[typeTwo.length - 1];
    }

    if (files.length === 1) {
      if (typeOne === "csv") {
        csvFile = files[0];
      } else if (typeOne === "json") {
        configFile = files[0];
      } else {
        return "error";
      }
    } else if (files.length === 2) {
      if (typeOne === "csv") {
        if (typeTwo === "json") {
          csvFile = files[0];
          configFile = files[1];
        } else {
          return "error";
        }
      } else if (typeOne === "json") {
        if (typeTwo === "csv") {
          csvFile = files[1];
          configFile = files[0];
        } else {
          return "error";
        }
      } else {
        return "error";
      }
    } else {
      return "error";
    }


    return new Promise((resolve, reject) => {
      let csvRead, configRead;

      if (csvFile != undefined) {
        csvRead = new Promise(function(res, rej) {
          const reader1 = new FileReader();
          reader1.readAsText(csvFile);
          reader1.onload = () => {
            res(d3.csvParse(reader1.result));
          };
        });
      }
      if (configFile != undefined) {
        configRead = new Promise(function(res, rej) {
          const reader2 = new FileReader();
          reader2.readAsText(configFile);
          reader2.onload = () => {
            const configText = JSON.parse(reader2.result);
            res(configText);
          };
        });
      }
      Promise.all([csvRead, configRead]).then((values) => {
        resolve({csv: values[0], config: values[1]});
      });
    });

  }
  function determineNextActions(verifiedFiles) {
    const infoText = document.getElementById("openInfoText");
    const ground = document.getElementById("ground");
    const scrollFromSpace = document.getElementById("scrollFromSpace");
    const csvText = verifiedFiles.csv;
    const configText = verifiedFiles.config;

    if (csvText === undefined) {
      globTime.storage.configJson = configText;
      if (globTime.storage.data === undefined) {
        infoText.textContent = "config File loaded. Open a csv file to continue.";
      } else {
        infoText.textContent = "";
        document.getElementById("ground").scrollIntoView({behavior: "smooth"});
        document.body.style["overflow-y"] = "scroll";
        parseConfig();
        prepGround();
      }
    } else {
      ground.style.display = "block";
      scrollFromSpace.style.display = "block";
      if (configText === undefined) {
        if (globTime.storage.configJson === undefined) {
          infoText.textContent = "csv file loaded. Optionally add a json for configuration.";
        } else {
          infoText.textContent = "";
          document.getElementById("ground").scrollIntoView({behavior: "smooth"});
          document.body.style["overflow-y"] = "scroll";
        }
      } else {
        infoText.textContent = "";
        document.getElementById("ground").scrollIntoView({behavior: "smooth"});
        document.body.style["overflow-y"] = "scroll";
        globTime.storage.configJson = configText;
      }
      parseCsv(csvText);
      parseConfig();
      prepGround();
    }
  }
  function parseCsv(timeData) {
    /* creates object with all data:
    data []
      day {}
        date,
        sunrise,
        sunset,
        groups []
          {}
            name,
            index,
            duration,
            multiDuration,
            activ []
              {}
                type,
                duration,
                multiDuration,
                index,
                comments []
                  {}
                    comment,
                    index,
                    duration,
                    multiDuration
                    data []
                      {}
                        from,
                        to,
                        duration,
                        multiLayer,
    dates[] = All unique dates
    groups[] = All unique groupes
    activities[] = All unique activities
    comments[] - All unique comments
    activityColors {} - creates random color if not defined.
      type,
      color
    */

    const data = [];
    const dates = [];
    const activities = [];
    const comments = [];

    function removeAndMerge() {
      const deleteActivities = [];
      timeData.forEach((activity, i) => {
        if (activity["Activity type"] == "") {
          timeData.splice(i);
        }
        if (activity.To === activity.From) {
          deleteActivities.push(i);
        } else {
          activity.To = new Date(activity.To);
          activity.From = new Date(activity.From);
          if (i > 0 && new Date(timeData[i - 1].Duration).getTime() > 0) {
            if (activity["Activity type"] === timeData[i - 1]["Activity type"] && activity.Comment === timeData[i - 1].Comment) {
              activity.To = timeData[i - 1].To;
              deleteActivities.push(i - 1);

            } else {
              const timeDif = timeData[i - 1].From.getTime() - activity.To.getTime();
              if (timeDif >= -60000 && timeDif <= 60000) {
                activity.To = new Date(activity.To.getTime() + timeDif);
              }
            }
          }
          activity.Duration = new Date(activity.To - activity.From);
        }
      });

      deleteActivities.reverse();
      deleteActivities.forEach(index => {
        timeData.splice(index, 1);
      });
    }
    function divideIntoDays() {
      let currentDate = timeData[0].To.toDateString();
      let dayData = [];
      let activityClones = [];

      globTime.storage.startTime = new Date(timeData[timeData.length - 1].From.getTime());
      globTime.storage.endTime = new Date(timeData[0].To.getTime());
      timeData.forEach(activity => {
        const type = activity["Activity type"];
        if (activities.includes(type) === false) {
          activities.push(type);
        }
        const comment = activity.Comment;
        if (comments.includes(comment) === false) {
          comments.push(comment);
        }
        const from = activity.From.toDateString();
        const to = activity.To.toDateString();
        if (from === currentDate) {
          dayData.push(activity);
        } else if (to === currentDate) {
          const midnight = new Date(activity.To.toDateString());
          const activityClone = {
            "Activity type": type,
            Duration: new Date(midnight.getTime() - activity.From.getTime()),
            To: new Date (midnight),
            From: new Date(activity.From.getTime()),
            Comment: activity.Comment
          };
          activity.From = new Date(midnight.getTime());
          activity.Duration = new Date(activity.To.getTime() - midnight.getTime());
          dayData.push(activity);
          activityClones.push(activityClone);
        } else {
          dates.push(currentDate);
          const riseSet = sunData(new Date(currentDate), 0);
          data.push({date: currentDate, tempData: dayData, sunrise: riseSet.rise, sunset: riseSet.set});
          currentDate = from;
          dayData = activityClones;
          activityClones = [];
          dayData.push(activity);
        }
      });
      const riseSet = sunData(new Date(currentDate), 0);
      data.push({date: currentDate, tempData: dayData, sunrise: riseSet.rise, sunset: riseSet.set});
      dates.push(currentDate);
      if (activityClones.length > 0) {
        dayData = activityClones;
        currentDate = dayData[dayData.length - 1].From.toDateString();
        const riseSet = sunData(new Date(currentDate), 0);
        data.push({date: currentDate, tempData: dayData, sunrise: riseSet.rise, sunset: riseSet.set});
        dates.push(currentDate);
      }
    }
    function multitasking() {
      data.forEach(day => {
        const multiActivities = [];
        const multiAreas = [];

        function findMultiAreas() {
          let multi = false;
          let activitiesInArea = [];
          let sectionSeperators = [];
          let maxTo = 0;
          for (let i = day.tempData.length - 2; i >= 0; i--) {
            const prev = day.tempData[i + 1];
            const current = day.tempData[i];
            maxTo = prev.To.getTime() > maxTo ? prev.To.getTime() : maxTo;
            if (maxTo > current.From.getTime()) {
              const toPush = [];
              if (!multi) {
                toPush.push(prev.From.getTime());
                toPush.push(prev.To.getTime());
                activitiesInArea.push(i + 1);
                multiActivities.push(i + 1);
                multi = true;
              }
              activitiesInArea.push(i);
              multiActivities.push(i);
              toPush.push(current.From.getTime());
              toPush.push(current.To.getTime());
              toPush.forEach(item => {
                if (!sectionSeperators.includes(item)) {
                  sectionSeperators.push(item);
                }
              });
            } else {
              if (multi) {
                multiAreas.push({
                  seperators: sectionSeperators,
                  activities: activitiesInArea
                });
                maxTo = 0;
                activitiesInArea = [];
                sectionSeperators = [];
                multi = false;
              }
            }
          }
        }
        function findSections() {
          multiAreas.forEach((area,i) => {
            let sections = [];
            let sep1;
            let sep2 = area.seperators[0];
            area.seperators.splice(0, 1);
            while (area.seperators.length > 0) {
              sep1 = sep2;
              sep2 = Math.min(...area.seperators);
              const thisSection = {
                start: sep1,
                end: sep2,
                activities: []
              };
              area.activities.forEach(activity => {
                const thisActivity = day.tempData[activity];
                if (thisActivity.From.getTime() <= sep1 && thisActivity.To.getTime() >= sep2) {
                  thisSection.activities.push(thisActivity);
                }
              });
              sections.push(thisSection);
              const index = area.seperators.indexOf(sep2);
              area.seperators.splice(index, 1);
            }
            multiAreas[i] = sections;
          });
        }
        function deleteOldNonMulti() {
          multiActivities.forEach(index => {
            day.tempData.splice(index, 1);
          });
        }
        function createNewMulti() {
          multiAreas.forEach(area => {
            let newActivities = [];
            area.forEach((section,i) => {
              if (section.activities.length > 1) {
                if (i > 0 && area[i - 1].activities.length > 1) {
                  let extendedActivity;
                  section.activities.forEach((activity,j) => {
                    const index = newActivities.findIndex(element => {
                      if (element["Activity type"] === activity["Activity type"]) {
                        if (element.To.getTime() === area[i - 1].end) {
                          return true;
                        }
                      }
                    });
                    if (index != -1) {
                      const thisActivity = newActivities[index];
                      if (thisActivity.Comment === activity.Comment) {
                        thisActivity.To = new Date(section.end);
                        thisActivity.Duration = new Date(section.end - thisActivity.From.getTime());
                        extendedActivity = {
                          index: j,
                          multiLayer: thisActivity.multiLayer
                        };
                      }
                    }
                  });
                  const thisActivity = extendedActivity.index === 0 ? section.activities[1] : section.activities[0];
                  const newActivity = {
                    "Activity type": thisActivity["Activity type"],
                    From: new Date(section.start),
                    To: new Date(section.end),
                    Duration: new Date(section.end - section.start),
                    Comment: thisActivity.Comment,
                    multiLayer: extendedActivity.multiLayer === 0 ? 1 : 0
                  };
                  newActivities.push(newActivity);
                } else {
                  const sectionNewActivities = [];
                  section.activities.forEach(activity => {
                    const newActivity = {
                      "Activity type": activity["Activity type"],
                      From: new Date(section.start),
                      To: new Date(section.end),
                      Duration: new Date(section.end - section.start),
                      Comment: activity.Comment
                    }
                    sectionNewActivities.push(newActivity);
                  });
                  const type0 = sectionNewActivities[0]["Activity type"];
                  const type1 = sectionNewActivities[1]["Activity type"];
                  const multiLayerPref0 = globTime.storage.multiLayerPref[type0];
                  const multiLayerPref1 = globTime.storage.multiLayerPref[type1];
                  if (multiLayerPref0 === multiLayerPref1) {
                    const activity0 = sectionNewActivities[0];
                    const activity1 = sectionNewActivities[1];
                    activity0.multiLayer = activity0.Duration.getTime() >= activity1.Duration.getTime() ? 0 : 1;
                    activity1.multiLayer = activity0.Duration.getTime() >= activity1.Duration.getTime() ? 1 : 0;
                    if (globTime.storage.multiLayerPref[type0] === undefined) {
                      globTime.storage.multiLayerPref[type0] = activity0.multiLayer;
                      globTime.storage.multiLayerPref[type1] = activity1.multiLayer;
                    }
                  } else {
                    if (multiLayerPref0 === undefined) {
                      sectionNewActivities[1].multiLayer = globTime.storage.multiLayerPref[type1];
                      sectionNewActivities[0].multiLayer = globTime.storage.multiLayerPref[type1] === 1 ? 0 : 1;
                    } else {
                      sectionNewActivities[0].multiLayer = globTime.storage.multiLayerPref[type0];
                      sectionNewActivities[1].multiLayer = globTime.storage.multiLayerPref[type0] === 1 ? 0 : 1;
                    }
                  }
                  sectionNewActivities.forEach(newActivity => {
                    newActivities.push(newActivity);
                  });
                }
              } else {
                const thisActivity = section.activities[0];
                const newActivity = {
                  "Activity type": thisActivity["Activity type"],
                  From: new Date(section.start),
                  To: new Date (section.end),
                  Duration: new Date(section.end - section.start),
                  Comment: thisActivity.Comment
                };
                newActivities.push(newActivity);
              }
            });
            newActivities.forEach(activity => {
              day.tempData.push(activity);
            });
            newActivities = [];
          });
        }

        findMultiAreas();
        findSections();
        deleteOldNonMulti();
        createNewMulti();
      });
    }
    function arrangeTimeData() {
      if (globTime.storage.configJson === undefined) {
        globTime.storage.configJson = {
          activityColors: {},
          groups: [{
            name: "noGroup",
            members: activities
          }]
        };
      }
      configGroups = globTime.storage.configJson.groups;
      data.forEach(day => {
        day.groups = [];
        configGroups.forEach((group, i) => {
          const groupData = day.tempData.filter(element => group.members.includes(element["Activity type"]));
          const newGroup = {
            name: group.name,
            index: i,
            activ: []
          };
          newGroup.duration = 0;
          newGroup.multiDuration = 0;
          group.members.forEach(activity => {
            const activData = groupData.filter(element => element["Activity type"] === activity);
            const newActiv = {
              type: activity,
              index: activities.indexOf(activity),
              duration: 0,
              multiDuration: 0,
              comments: []
            };
            if (activData.length > 0) {
              comments.forEach((comment, j) => {
                const commentData = activData.filter(element => element.Comment === comment);
                if (commentData.length > 0) {
                  const newComment = {
                    comment: comment,
                    index: j,
                    duration: 0,
                    multiDuration: 0,
                    data: []
                  };
                  commentData.forEach(com => {
                    const duration = com.Duration.getTime();
                    const newCommentData = {
                      from: new Date(com.From.getTime() - new Date(day.date).getTime()),
                      to: new Date(com.To.getTime() - new Date(day.date).getTime()),
                      duration: new Date(duration)
                    };
                    if (com.multiLayer === undefined) {
                      newGroup.duration += duration;
                      newActiv.duration += duration;
                      newComment.duration += duration;
                    } else {
                      newCommentData.multiLayer = com.multiLayer;
                      newComment.multiDuration += duration;
                      newActiv.multiDuration += duration;
                      newGroup.multiDuration += duration;
                    }
                    newComment.data.push(newCommentData);
                  });
                  newComment.multiDuration = new Date(newComment.multiDuration);
                  newComment.duration = new Date(newComment.duration);
                  newActiv.comments.push(newComment);
                }
              });
            }
            newActiv.duration = new Date(newActiv.duration);
            newActiv.multiDuration = new Date(newActiv.multiDuration);
            newGroup.activ.push(newActiv);
          });
          newGroup.duration = new Date(newGroup.duration);
          newGroup.multiDuration = new Date(newGroup.multiDuration);
          day.groups.push(newGroup);
        });
        delete day.tempData;
      });
    }
    function findMonths(dates) {
      /* findMonths(dates) returns an array which contains one object for
      every month that is present in [dates]. The object contains the name
      of the month and the first and last dates from that month that are
      present in [dates]. */
      const months = [];
      const newMonth = {
        name: undefined,
        firstDate: undefined,
        lastDate: undefined
      };
      dates.reverse();
      dates.forEach((date, i) => {
        const thisDate = new Date(date);
        thisMonth = thisDate.toLocaleDateString("en-en", {month: "long"});
        if (i === 0) {
          newMonth.name = thisMonth;
          newMonth.firstDate = thisDate.toDateString();
        } else if (newMonth.name != thisMonth) {
          newMonth.lastDate = new Date(thisDate.setDate(thisDate.getDate() - 1)).toDateString();
          const pushMonth = {
            name: newMonth.name,
            firstDate: newMonth.firstDate,
            lastDate: newMonth.lastDate
          };
          months.push(pushMonth);
          newMonth.name = thisMonth;
          newMonth.firstDate = new Date(thisDate.setDate(thisDate.getDate() + 1)).toDateString();
        } else if (i === dates.length - 1) {
          newMonth.lastDate = thisDate.toDateString();
          months.push(newMonth);
        }
      });
      months.reverse();
      dates.reverse();
      return months;
    }

    removeAndMerge();
    divideIntoDays();
    multitasking();
    arrangeTimeData();


    activities.forEach((activity, i) => {
      activityVisibility[activity] = "visible";
    });
    globTime.storage.configJson.groups.forEach(group => {
      globTime.storage.groups.push(group.name);
    });

    globTime.storage.data = data;
    globTime.storage.dates = dates;
    globTime.storage.months = findMonths(dates);
    globTime.storage.activities = activities;
    globTime.storage.comments = comments;
  }
  function parseConfig() {
    function randomColor() {
      const hexNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      let colorString = "#";
      for (let i = 0; i < 6; i++) {
        colorString += hexNumbers[Math.floor(Math.random() * (hexNumbers.length - 0.01))];
      }
      return colorString;
    }
    function parseActivityColors() {
      if (globTime.storage.configJson === undefined) {
        activities.forEach(activity => {
          activityColors[activity] = randomColor();
        });
      } else {
        activities.forEach(activity => {
          if (globTime.storage.configJson.activityColors[activity] === undefined) {
            activityColors[activity] = randomColor();
            globTime.storage.unknownActivities[activity] = true;
          } else {
            if (globTime.storage.unknownActivities[activity]) {
              delete globTime.storage.unknownActivities[activity];
            }
            activityColors[activity] = globTime.storage.configJson.activityColors[activity];
          }
        });
      }
    }

    const activityColors = {};
    const activities = globTime.storage.activities;
    parseActivityColors();
    globTime.storage.configJson.activityColors = activityColors;
    globTime.storage.activityColors = activityColors;
  }
  function prepGround(redraw) {
    function getallActivities(data) {
      const allActivities = [];
      data.forEach(day => {
        day.groups.forEach(group => {
          group.activ.forEach(activity => {
            if (globTime.storage.commentFilter.length === 0) {
              if (activityVisibility[activity.type] === "visible") {
                allActivities.push({
                  date: day.date,
                  type: activity.type,
                  duration: activity.duration,
                  multiDuration: activity.multiDuration
                });
              }
            } else {
              activity.comments.forEach(comment => {
                if (globTime.storage.commentFilter.includes(comment.comment)) {
                  allActivities.push({
                    date: day.date,
                    type: activity.type,
                    comment: comment.comment,
                    duration: comment.duration,
                    multiDuration: comment.multiDuration
                  });
                }
              });
            }
          });
        });
      });
      return allActivities;
    }
    function parseDuration(duration, multi) {
      const durationMS = duration.getTime();
      const totalMinutes = durationMS / (1000 * 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const restMinutes = Math.floor(totalMinutes % 60);
      return restMinutes < 10 ? totalHours + ":0" + restMinutes : totalHours + ":" + restMinutes;
    }
    function drawLegend() {
      function updateCommentFilter() {
        comments.forEach((comment, i) => {
          const allOfComment = document.querySelectorAll(".C" + i);
          if (globTime.storage.commentFilter.length > 0) {
            if (!globTime.storage.commentFilter.includes(comment)) {
              allOfComment.forEach(elem => {
                elem.style.visibility = "hidden";
              });
            } else {
              allOfComment.forEach(elem => {
                elem.style.visibility = null;
              });
            }
          } else {
            allOfComment.forEach(elem => {
              elem.style.visibility = null;
            });
          }
        });
      }
      function createActiv(name) {
        const activLi = document.createElement("li");
        const colorColumn = document.createElement("input");
        const activName = document.createElement("p");
        const activCheckbox = document.createElement("input");
        const activLabel = document.createElement("label");

        activLabel.append(activName);
        activLabel.append(activCheckbox);
        activName.append(name);
        activLi.append(colorColumn);
        activLi.append(activLabel);

        colorColumn.type = "color";
        colorColumn.classList.add("legendColor");
        colorColumn.classList.add("activity");
        colorColumn.value = globTime.storage.activityColors[name];
        activCheckbox.type = "checkbox";
        activCheckbox.name = "legend-" + name;
        activCheckbox.checked = "true";
        activLabel.classList.add("legendCheckbox");

        if (globTime.storage.unknownActivities[name]) {
          activLabel.classList.add("new");
          const text = name + " has been assigned a new, random color because it was undefined in the config file";
          activLabel.text = text;
          activLabel.addEventListener("mouseover", showTooltip);
          activLabel.addEventListener("mouseout", hideTooltip);
        }

        colorColumn.addEventListener("change", (e) => {
          document.querySelector(".configAlert").style.display = "block";
          const newChangeLi = document.createElement("li");
          const i = activities.indexOf(name);
          const elementClass = "colorChange" + i;
          newChangeLi.className = "colorChange" + i;
          newChangeLi.textContent = "Color of " + name + " changed to " + colorColumn.value + ".";
          const oldChange = document.querySelector("." + elementClass);
          if (oldChange != undefined) {
            oldChange.remove();
          }
          const allElem = document.querySelectorAll(".A" + i + " rect, .A" + i + " circle");
          allElem.forEach(elem => {
            elem.style.fill = colorColumn.value;
          });
          if (activLabel.classList.contains("new")) {
            activLabel.classList.remove("new");
            activLabel.removeEventListener("mouseover", showTooltip);
            activLabel.removeEventListener("mouseout", hideTooltip);
          }
          document.querySelector(".configChanges").append(newChangeLi);
          globTime.storage.activityColors[name] = colorColumn.value;
        })

        $(activCheckbox).checkboxradio({
          icon: false
        }).on("change", (t) => {
          let visibility;
          if (t.target.checked) {
            visibility = "visible";
          } else {
            visibility = "hidden";
          }
          activityVisibility[name] = visibility;
          const i = activities.indexOf(name);
          let thisActivAll = document.querySelectorAll(".A" + i);
          thisActivAll.forEach(item => {
            item.style.visibility = visibility;
          });
          prepGround();
        });

        return activLi;
      }
      function createGroup(color, name, membersUl) {
        const groupCheckbox = document.createElement("input");
        const groupLabel = document.createElement("label");
        const groupLi = document.createElement("li");
        const colorColumn = document.createElement("input");
        const contentColumn = document.createElement("div");
        const groupName = document.createElement("p");

        groupLabel.append(groupName);
        groupLabel.append(groupCheckbox);
        contentColumn.append(groupLabel);
        contentColumn.append(membersUl);
        groupLi.append(colorColumn);
        groupLi.append(contentColumn);

        groupCheckbox.type = "checkbox";
        groupCheckbox.checked = "true";
        groupLabel.className = "legendCheckbox"
        groupName.textContent = name;
        contentColumn.className = "legendContent";
        colorColumn.type= "color";
        colorColumn.value = color;
        colorColumn.classList.add("legendColor");
        colorColumn.classList.add("group");

        $(groupCheckbox).checkboxradio({
          icon: false
        }).on("change", (e) => {
          const allInputs = membersUl.querySelectorAll("input[type='checkbox']");
          allInputs.forEach(input => {
            let visibility;
            if (e.currentTarget.checked) {
              input.checked = true;
              visibility = "visible";
            } else {
              input.checked = "";
              visibility = "hidden";
            }
            const inputName = input.name.split("-")[1];
            activityVisibility[inputName] = visibility;
            const i = activities.indexOf(inputName);
            const thisActivAll = document.querySelectorAll(".A" + i);
            thisActivAll.forEach(item => {
              item.style.visibility = visibility;
            });
            $(input).checkboxradio("refresh");
          });
          prepGround();
        });

        return groupLi;
      }
      function createFilterLi(string) {
        if (string === "") {
          return;
        }
        const input = document.getElementById("inputFilter")
        if (input.text != undefined) {
          input.style["border-color"] = null;
          input.removeEventListener("mouseover", showTooltip);
          input.removeEventListener("mouseout", hideTooltip);
        }
        if (!comments.includes(string)) {
          input.style["border-color"] = "red";
          input.text = "There is no comment which matches this input.";
          input.addEventListener("mouseover", showTooltip);
          input.addEventListener("mouseout", hideTooltip);
          return;
        }
        globTime.storage.commentFilter.push(string);
        const newLi = document.createElement("li");
        const buttonRemLi = document.createElement("button");
        newLi.textContent = string;
        buttonRemLi.textContent = "X";
        buttonRemLi.className = "deleteFilter";
        newLi.append(buttonRemLi);
        document.querySelector(".legend > ul").append(newLi);
        $(buttonRemLi).button().on("click", () => {
          newLi.remove();
          const index = globTime.storage.commentFilter.indexOf(string);
          globTime.storage.commentFilter.splice(index, 1);
          updateCommentFilter();
          prepGround();
        });
        input.value = "";
        updateCommentFilter();
        prepGround();
      }
      function showTooltip(e) {
        tooltipText = e.currentTarget.text;
        tooltip.style.display = "block",
        tooltip.textContent = tooltipText;
      }
      function hideTooltip() {
        tooltipText = "";
        tooltip.style.display = "none";
        tooltip.textContent = tooltipText;
      }
      function changeAllVisibility(visibility) {
        activities.forEach((activity,i) => {
          if (activityVisibility[activity] != visibility) {
            activityVisibility[activity] = visibility;
            const allActiv = document.querySelectorAll(".A" + i);
            allActiv.forEach(activ => {
              activ.style.visibility = visibility;
            });
          }
        });
      }
      function createInputFilter() {
        $("#inputFilter").on("keyup", e => {
          if (e.keyCode === 13) {
            createFilterLi(e.target.value);
          }
        });
        $("#buttonAddFilter").on("click", () => {
          const string = document.querySelector("#inputFilter").value;
          createFilterLi(string);
        });
        const filterDatalist = document.getElementById("comments");
        comments.forEach(comment => {
          const filterOption = document.createElement("option");
          filterOption.value = comment;
          filterDatalist.append(filterOption);
        });
      }
      let noGroupActiv;
      const legendUl = document.querySelector("#legendActivity");
      const noGroupIndex = globTime.storage.configJson.groups.length - 1;
      noGroupActiv = globTime.storage.configJson.groups[noGroupIndex].members;
      globTime.storage.configJson.groups.forEach((group, i) => {
        if (group.name != "noGroup") {
          const membersUl = document.createElement("ul");
          group.members.forEach((member, j) => {
            const memberLi = createActiv(member);
            membersUl.append(memberLi);
          });
          const groupElement = createGroup(group.color, group.name, membersUl);
          legendUl.append(groupElement);
        }
      });
      noGroupActiv.forEach((activity, i) => {
        legendUl.append(createActiv(activity));
      });
      createInputFilter();

      $("#legendSelectAll").button()
      .on("click", (e) => {
        const legendCheckbox = document.querySelectorAll(".legendCheckbox");
        legendCheckbox.forEach((check, i) => {
          const input = check.querySelector("input");
          if (!input.checked) {
            input.checked = true;
          }
          $(input).checkboxradio("refresh");
        });
        changeAllVisibility("visible");
        prepGround();
      });
      $("#legendDeselectAll").button()
      .on("click", (e) => {
        const legendCheckbox = document.querySelectorAll(".legendCheckbox");
        legendCheckbox.forEach((check, i) => {
          const input = check.querySelector("input");
          if (input.checked) {
            $(input).removeAttr("checked");
          }
          $(input).checkboxradio("refresh");
        });
        changeAllVisibility("hidden");
      });
      $(".legendColor").button();
    }
    function drawTimeLine() {
      const nameMargin = globTime.config.nameMargin;
      let text, monthWidth, textWidth;

      const timeLine = timeChart.append("g")
        .attr("transform", "translate(" + margin.left + ",0)");
      const timeLineMonth = timeLine.selectAll(".month")
        .data(months)
        .enter().append("g")
          .attr("class", "month");

      /* append month name */
      timeLineMonth.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (d,i) => {
          text = d.name + " " + new Date(d.firstDate).getFullYear();
          textWidth = context.measureText(text).width;
          monthWidth = xScale(d.lastDate) + xScale.bandwidth() - xScale(d.firstDate);
          return xScale(d.firstDate) + monthWidth / 2;
        })
        .attr("y", timeLineMargin.top + 5)
        .text((d) => {
          return d.name + " " + new Date(d.firstDate).getFullYear();
        });

      /* append left line */
      timeLineMonth.append("line")
        .attr("x1", d => xScale(d.firstDate))
        .attr("y1", timeLineMargin.top)
        .attr("x2", (d) => {
          text = d.name + " " + new Date(d.firstDate).getFullYear();
          textWidth = context.measureText(text).width;
           monthWidth = xScale(d.lastDate) - xScale(d.firstDate);
          const lineLength = (monthWidth - textWidth) / 2 - nameMargin;
          return xScale(d.firstDate) + lineLength;
        })
        .attr("y2", timeLineMargin.top)
        .attr("stroke", (d) => {
          if (monthWidth <= (textWidth + 2 * nameMargin)) {
            return "";
          } else {
            return "#999999";
          }
        });

      /* append right line */
      timeLineMonth.append("line")
        .attr("x1", (d, i) => {
          text = d.name + " " + new Date(d.firstDate).getFullYear();
          textWidth = context.measureText(text).width;
          monthWidth = xScale(d.lastDate) - xScale(d.firstDate);
          lineLength = (monthWidth - textWidth) / 2 - nameMargin;
          return xScale(d.lastDate) - lineLength + xScale.bandwidth();
        })
        .attr("y1", timeLineMargin.top)
        .attr("x2", d => xScale(d.lastDate) + xScale.bandwidth())
        .attr("y2", timeLineMargin.top)
        .attr("stroke", (d) => {
          if (monthWidth <= (textWidth + 2 * nameMargin)) {
            return "";
          } else {
            return "#999999";
          }
        });

      /* append separator*/
      const sepLength = globTime.config.timeLineSeparatorLength;
      timeLineMonth.append("line")
        .attr("x1", d => xScale(d.lastDate) + xScale.bandwidth())
        .attr("y1", timeLineMargin.top - sepLength / 2)
        .attr("x2", d => xScale(d.lastDate) + xScale.bandwidth())
        .attr("y2", timeLineMargin.top + sepLength / 2)
        .attr("stroke", (d, i) => {
          date = new Date(d.lastDate);
          if (date.getMonth() != new Date(date.setDate(date.getDate() + 1)).getMonth()) {
            return "#999999";
          } else if (i === 0 && date.getDate() === 1) {
            return "#999999";
          }
        });


      /* append individual dates */
      const hoverDateBar = timeChart.append("g")
        .attr("transform", "translate(" + margin.left + ",0)");
      hoverDateBar.selectAll(".hoverDate")
        .data(dates)
        .enter().append("text")
          .attr("class", d => "hoverDate D" + (new Date(d).getMonth() + 1) + "-" + new Date(d).getDate())
          .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("y", timeLineMargin.top + 23)
          .text((d) => new Date(d).getDate())
          .attr("style", (d) => {
            if (new Date(d).getDay() === 0) {
              return "fill: #de664e";
            }
          });
    }
    function drawChronoAxisY() {
      const oldAxisY = document.querySelector("g.timeChronoAxisY");
      if (oldAxisY != undefined) {
        oldAxisY.remove();
      }
      const tickValues = [];
      for (let i = yScale.domain()[1] / tickCount; i < yScale.domain()[1]; i += yScale.domain()[1] / tickCount) {
        tickValues.push(i);
      }
      const axisY = d3.axisLeft(yScale)
        .tickFormat(x => {
          const date = new Date(x);
          const hours = date.getHours() - 1;
          const minutes = date.getMinutes();
          let tick = hours + ":";
          if (minutes < 10) {
            tick += "0";
          }
          tick += minutes;
          return tick;
        })
        .tickValues(tickValues);

      d3.select("#timeLeftAxis > svg")
        .attr("width", "50")
        .attr("height", height)
        .append("g")
          .attr("class", "timeChronoAxisY")
          .attr("transform", "translate(50, " + margin.top + ")")
          .call(axisY)
    }
    function drawChrono() {
      const chart = document.querySelector(".timeChart .chrono")
      if (chart != undefined) {
        chart.remove();
      }
      function translate(d) {
        return "translate(" + (xScale(d.date) - 0.001) + ",0)";
      }
      timeChart.append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top +")")
        .attr("class", "chrono")
        .selectAll(".day")
        .data(data)
        .enter().append("g")
          .attr("class", "day")
          .attr("transform", translate)
          .on("mouseover", (e,d) => {
            const selector = ".D" + (new Date(d.date).getMonth() + 1) + "-" + new Date(d.date).getDate();
            document.querySelector(selector).style["font-weight"] = "bold";
          })
          .on("mouseout", (e,d) => {
            const selector =  ".D" + (new Date(d.date).getMonth() + 1) + "-" + new Date(d.date).getDate();
            document.querySelector(selector).style["font-weight"] = null;
          })
          .selectAll(".group")
          .data(d => d.groups)
          .enter().append("g")
            .attr("class", d => "group G" + d.index)
            .attr("fill", d => d.name === "noGroup" ? null : globTime.storage.configJson.groups[d.index].color)
            .selectAll(".activity")
            .data(d => d.activ.filter(elem => elem.duration.getTime() + elem.multiDuration.getTime() > 0))
            .enter().append("g")
              .attr("class", d => "activity A" + d.index)
              .attr("fill", d => activityColors[d.type])
              .selectAll(".comment")
              .data(d => d.comments)
              .enter().append("g")
                .attr("class", d => "comment C" + d.index)
                .selectAll("rect")
                .data(d => d.data)
                .enter().append("rect")
                  .attr("height", d => yScale(d.duration))
                  .attr("width", d => d.multiLayer === undefined ? xScale.bandwidth() + 0.5 : xScale.bandwidth() / 2 + 0.5)
                  .attr("y", d => yScale(d.from))
                  .attr("x", d => d.multiLayer === 1 ? xScale.bandwidth() / 2 : 0)
                  .on("mouseover", (e, d) => {
                    const comElement = e.target.parentElement;
                    const commentIndex = comElement.classList[1].slice(1);
                    const comment = comments[commentIndex];

                    const activityElement = comElement.parentElement;
                    const activityIndex = activityElement.classList[1].slice(1);
                    const activity = globTime.storage.activities[activityIndex];

                    const duration = "<br>" + parseDuration(d.from) + " to " + parseDuration(d.to) + " = " + parseDuration(d.duration);
                    const comString = comment.length > 0 ? "<br>" + comment : "";
                    const multi = d.multiLayer === undefined ? "" : "<br> (Multitasking)";

                    tooltip.style.display = null;
                    tooltip.innerHTML = activity + multi + duration + comString;
                    ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
                  })
                  .on("mouseout", () => {
                    tooltip.style.display = "none";
                  });
    }
    function drawTimeGraph() {
      function drawTimeGraphAxisY() {
        const oldAxisY = document.querySelector("g.timeGraphAxisY");
        if (oldAxisY != undefined) {
          oldAxisY.remove();
        }
        const tickValues = [];
        if (maxHeight / tickCount >= 7200000) {
          for (let i = 7200000; i < maxHeight; i += 7200000) {
            tickValues.push(i);
          }
        } else if (maxHeight / tickCount >= 3600000){
          for (let i = 3600000; i < maxHeight; i += 3600000) {
            tickValues.push(i);
          }
        } else {
          for (let i = 1800000; i < maxHeight; i += 1800000) {
            tickValues.push(i);
          }
        }
        const axisY = d3.axisLeft(yScale)
          .tickFormat(x => {
            const date = new Date(x);
            const hours = date.getHours() - 1;
            const minutes = date.getMinutes();
            let tick = hours + ":";
            if (minutes < 10) {
              tick += "0";
            }
            tick += minutes;
            return tick;
          })
          .tickValues(tickValues);

        d3.select("#timeLeftAxis > svg")
          .attr("height", height)
          .append("g")
            .attr("class", "timeGraphAxisY")
            .attr("transform", "translate(50, " + margin.top + ")")
            .call(axisY)
      }
      function groupLines() {
        const groupData = [];
        groups.forEach(group => {
          if (group != "noGroup"){
            let thisGroup = [];
            data.forEach(day => {
              day.groups.forEach(dayGroup => {
                if (dayGroup.name === group) {
                  thisGroup.push({
                    date: day.date,
                    duration: dayGroup.duration,
                    multiDuration: dayGroup.multiDuration
                  });
                }
              });
            });
            groupData.push({
              name: group,
              data: thisGroup
            });
          }
        });
        function groupTotalLines() {
          timeGraph.selectAll(".group .total")
          .data(groupData)
          .enter().append("g")
            .attr("class", d => "total group G" + groups.indexOf(d.name))
            .append("path")
            .attr("stroke", d => globTime.storage.configJson.groups.find(elem => elem.name === d.name).color)
            .attr("d", d => totalLine(d.data));
            groupData.forEach(group => {
              if (group.data.duration + group.data.multiDuration > 0) {
                timeGraph.select(".G" + groups.indexOf(group.name)).append("circle")
                .attr("fill", globTime.storage.configJson.groups.find(elem => elem.name === group.name).color)
                .attr("cx", xScale(group.data.date) + xScale.bandwidth() / 2)
                .attr("cy", yScale(group.data.duration + group.data.multiDuration))
                .on("mouseover", () => {
                  tolltip.style.display = null;
                  const totalDuration = new Date(group.data.duration.getTime() + group.data.multiDuration.getTime());
                  tooltip.innerHTML = group.name + "<br>includes Multitasking<br>" + parseDuration(totalDuration, true);
                  ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
                })
              }
          });
        }
        function groupNonMulti() {
          timeGraph.selectAll(".group .nonMulti")
          .data(groupData)
          .enter().append("g")
          .attr("class", d => "nonMulti group G" + groups.indexOf(d.name))
          .append("path")
          .attr("stroke", d => globTime.storage.configJson.groups.find(elem => elem.name === d.name).color)
          .attr("d", d => nonMultiLine(d.data));
          groupData.forEach(group => {
            if (group.data.duration > 0) {
              timeGraph.select(".G" + groups.indexOf(group.name)).append("circle")
              .attr("fill", globTime.storage.configJson.groups.find(elem => elem.name === group.name).color)
              .attr("cx", xScale(group.data.date) + xScale.bandwidth() / 2)
              .attr("cy", yScale(group.data.duration))
              .on("mouseover", () => {
                tolltip.style.display = null;
                tooltip.innerHTML = group.name + "<br>" + parseDuration(group.data.duration, true);
                ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
              })
            }
          });
        }
        function groupMulti() {
          timeGraph.selectAll(".group .multi")
          .data(groupData)
          .enter().append("g")
          .attr("class", d => "multi group G" + groups.indexOf(d.name))
          .append("path")
          .attr("stroke", d => globTime.storage.configJson.groups.find(elem => elem.name === d.name).color)
          .attr("d", d => multiLine(d.data));
          groupData.forEach(group => {
            if (group.data.multiDuration > 0) {
              timeGraph.select(".G" + groups.indexOf(group.name)).append("circle")
              .attr("fill", globTime.storage.configJson.groups.find(elem => elem.name === group.name).color)
              .attr("cx", xScale(group.data.date) + xScale.bandwidth() / 2)
              .attr("cy", yScale(group.data.multiDuration))
              .on("mouseover", () => {
                tolltip.style.display = null;
                tooltip.innerHTML = group.name + "<br>(Multitasking)<br>" + parseDuration(group.data.multiDuration);
                ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
              })
            }
          });
        }
        groupTotalLines();
        groupNonMulti();
        groupMulti();
      }
      function activityLines() {
        const activityData = [];
        if (allActivities[0].comment != undefined) {
          globTime.storage.commentFilter.forEach(filter => {
            const thisFilter = allActivities.filter(elem => elem.comment === filter);
            const visibleActivities = activities.filter(elem => activityVisibility[elem] === "visible");
            visibleActivities.forEach(activity => {
              const thisActivity = thisFilter.filter(elem => elem.type === activity);
              if (thisActivity.length > 0) {
                const allDates = [];
                thisActivity.forEach(item => {
                  allDates.push(item.date);
                });
                dates.forEach(date => {
                  if (!allDates.includes(date)) {
                    thisActivity.push({
                      date: date,
                      type: activity,
                      duration: new Date(0),
                      multiDuration: new Date(0)
                    })
                  }
                });
                thisActivity.sort((e1, e2) => {
                  if (new Date(e1.date).getTime() < new Date(e2.date).getTime()) {
                    return true;
                  }
                });
                activityData.push(thisActivity);
              }
            });
          });
        } else {
          activities.forEach(activity => {
            if (activityVisibility[activity] === "visible") {
              const thisActivity = allActivities.filter(elem => elem.type === activity);
              activityData.push(thisActivity);
            }
          })
        }
        function activityTotalLines() {
          timeGraph.selectAll(".activity .total")
            .data(activityData)
            .enter().append("g")
              .attr("class", d => "total activity A" + activities.indexOf(d[0].type))
              .append("path")
                .attr("stroke", d => activityColors[d[0].type])
                .attr("d", d => totalLine(d));
          activityData.forEach(type => {
            type.forEach(activity => {
              if (activity.duration.getTime() + activity.multiDuration.getTime() > 0) {
                timeGraph.select(".total.A" + activities.indexOf(activity.type)).append("circle")
                  .attr("fill", activityColors[activity.type])
                  .attr("cx",xScale(activity.date) + xScale.bandwidth() / 2)
                  .attr("cy",yScale(activity.duration.getTime() + activity.multiDuration.getTime()))
                  .on("mouseover", () => {
                    tooltip.style.display = null;
                    const totalDuration = new Date(activity.duration.getTime() + activity.multiDuration.getTime());
                    const tooltipText = activity.type + "<br>includes Multitasking<br>" + parseDuration(totalDuration, true)
                    tooltip.innerHTML = tooltipText;
                    ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
                  });
              }
            });
          });
        }
        function activityNonMulti() {
          timeGraph.selectAll(".activity .nonMulti")
            .data(activityData)
            .enter().append("g")
              .attr("class", d => "activity nonMulti A" + activities.indexOf(d[0].type))
              .append("path")
                .attr("stroke", d => activityColors[d[0].type])
                .attr("d", d => nonMultiLine(d));
          activityData.forEach(type => {
            type.forEach(activity => {
              if (activity.duration.getTime() > 0) {
                timeGraph.select(".nonMulti.A" + activities.indexOf(activity.type)).append("circle")
                  .attr("fill", activityColors[activity.type])
                  .attr("cx",xScale(activity.date) + xScale.bandwidth() / 2)
                  .attr("cy",yScale(activity.duration.getTime()))
                  .on("mouseover", () => {
                    tooltip.style.display = null;
                    tooltip.innerHTML = activity.type + "<br>" + parseDuration(activity.duration);
                    ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
                  });
              }
            });
          });
        }
        function activityMulti() {
          timeGraph.selectAll(".activity .multi")
            .data(activityData)
            .enter().append("g")
              .attr("class", d => "activity multi A" + activities.indexOf(d[0].type))
              .append("path")
                  .attr("stroke", d => activityColors[d[0].type])
                  .attr("d", d => multiLine(d));
          activityData.forEach(type => {
            type.forEach(activity => {
              if (activity.multiDuration.getTime() > 0) {
                timeGraph.select(".multi.A" + activities.indexOf(activity.type)).append("circle")
                  .attr("fill", activityColors[activity.type])
                  .attr("cx",xScale(activity.date) + xScale.bandwidth() / 2)
                  .style("stroke-dasharray", (globTime.config.graph.dashArray))
                  .attr("cy",yScale(activity.multiDuration.getTime()))
                  .on("mouseover", () => {
                    tooltip.style.display = null;
                    tooltip.innerHTML = activity.type + "<br>(Multitasking)<br>" + parseDuration(activity.multiDuration);
                    ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
                  });
              }
            });
          });
        }
        activityTotalLines();
        activityNonMulti();
        activityMulti();
      }

      const charts = document.getElementById("d3TimeChart").querySelector("g.graph");
      if (charts != null) {
        charts.remove();
      }
      const allActivities = getallActivities(data);
      const maxHeight = d3.max(allActivities, elem => elem.duration.getTime() + elem.multiDuration.getTime());

      const timeGraph = timeChart.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "graph");

      if (maxHeight === undefined) {
        return;
      }

      const yScale = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([height, 0]);

      drawTimeGraphAxisY();

      const totalLine = d3.line()
        .curve(globTime.config.graph.lineType)
        .x(d => xScale(d.date) + xScale.bandwidth() / 2)
        .y(d => yScale(d.duration.getTime() + d.multiDuration.getTime()));
      const nonMultiLine = d3.line()
        .curve(globTime.config.graph.lineType)
        .x(d => xScale(d.date) + xScale.bandwidth() / 2)
        .y(d => yScale(d.duration.getTime()));
      const multiLine = d3.line()
        .curve(globTime.config.graph.lineType)
        .x(d => xScale(d.date) + xScale.bandwidth() / 2)
        .y(d => yScale(d.multiDuration.getTime()));

      // groupLines();
      activityLines();

      timeGraph.selectAll("circle")
        .attr("stroke", "none")
        .attr("r", globTime.config.graph.circleRadius)
        .on("mouseout", () => {
          tooltip.style.display = "none";
        });
      timeGraph.selectAll("path")
        .attr("fill", "none")
        .attr("stroke-weight", globTime.config.graph.strokeWeight);
      timeGraph.selectAll(".multi > path")
        .style("stroke-dasharray", (globTime.config.graph.dashArray));
    }
    function drawTimeSum() {
      function arrangeTimeSumData() {
        function sumActivities(data) {
          const thisActivityDuration = {
            type: data[0].type,
            duration: 0
          };
          const thisActivityMulti = {
            type: data[0].type,
            duration: 0,
            multi: true
          };
          if (data[0].comment != undefined) {
            thisActivityDuration.comment = data[0].comment;
            thisActivityMulti.comment = data[0].comment;
          }
          data.forEach(item => {
            thisActivityDuration.duration += item.duration.getTime();
            thisActivityMulti.duration += item.multiDuration.getTime();
          })
          thisActivityDuration.duration = new Date(thisActivityDuration.duration);
          thisActivityMulti.duration = new Date(thisActivityMulti.duration);
          return [thisActivityDuration, thisActivityMulti];
        }
        const timeSumData = [];
        const activitiesInvolved = [];
        const totalDurations = {};
        let totalDuration = 0;
        const from = $("#inputSumFrom").datepicker("getDate");
        const to = $("#inputSumTo").datepicker("getDate");
        const fromIndex = dates.indexOf(from.toDateString());
        const toIndex = dates.indexOf(to.toDateString());
        const multi = document.getElementById("buttonMulti").checked;
        if (from.getTime() <= to.getTime()) {
          const periodData = data.filter((elm, i) => i >= toIndex && i <= fromIndex);
          const allActivities = getallActivities(periodData);
          if (allActivities.length === 0) {
            return;
          }
          allActivities.forEach(activity => {
            totalDuration += activity.duration.getTime() + activity.multiDuration.getTime() / 2;
          });
          if (allActivities[0].comment != undefined) {
            globTime.storage.commentFilter.forEach(filter => {
              const thisFilter = allActivities.filter(elem => elem.comment === filter);
              const visibleActivities = activities.filter(elem => activityVisibility[elem] === "visible");
              visibleActivities.forEach(activity => {
                activitiesInvolved.push(activity);
                const thisActivity = thisFilter.filter(elem => elem.type === activity);
                if (thisActivity.length > 0) {
                  const summedActivities = sumActivities(thisActivity);
                  if (multi) {
                    timeSumData.push(summedActivities[0]);
                    timeSumData.push(summedActivities[1]);
                  } else {
                    timeSumData.push({
                      type: summedActivities[0].type,
                      duration: new Date(summedActivities[0].duration.getTime() + summedActivities[1].duration.getTime())
                    });
                  }
                  totalDurations[activity] = summedActivities[0].duration + summedActivities[1].duration;
                }
              });
            });
          } else {
            activities.forEach(activity => {
              if (activityVisibility[activity] === "visible") {
                activitiesInvolved.push(activity);
                const thisActivity = allActivities.filter(elem => elem.type === activity);
                const summedActivities = sumActivities(thisActivity);
                totalDurations[activity] = new Date(summedActivities[0].duration.getTime() + summedActivities[1].duration.getTime());
                if (multi) {
                  timeSumData.push(summedActivities[0]);
                  timeSumData.push(summedActivities[1]);
                } else {
                  timeSumData.push({
                    type: summedActivities[0].type,
                    duration: new Date(summedActivities[0].duration.getTime() + summedActivities[1].duration.getTime())
                  });
                }
              }
            });
          }
        }
        timeSumData.sort((a,b) => {
          if (a.type === b.type) {
            return a.multi ? 1 : -1;
            // return a.duration < b.duration ? 1 : -1;
          } else {
            return totalDurations[a.type] < totalDurations[b.type] ? 1 : -1;
          }
        });
        return {
          data: timeSumData,
          duration: totalDuration,
          activities: activitiesInvolved
        };
      }
      const sumData = arrangeTimeSumData();
      if (sumData === undefined) {
        return;
      }
      const pie = d3.pie()
        .value(d => d.duration)
        .sort(null);
      const pieData = pie(sumData.data);
      const height = window.innerHeight - globTime.config.headerHeight;
      const width = window.innerWidth - globTime.config.legendWidth - globTime.config.scrollBarYWidth;
      const margin = globTime.config.timeSumMargin;
      const radius = Math.floor(Math.min(height, width) / 2 - margin.top - margin.bottom);
      const chart = document.querySelectorAll("#d3TimeSum > svg");
      const timeSumTranslateY = height >= width ? height / 2 : margin.top + radius;
      if (chart.length > 0) {
        chart[0].remove();
      }
      const timeSum = d3.select("#d3TimeSum").append("svg")
        .attr("height", height)
        .attr("width", width);
      const defs = timeSum.append("defs");
      sumData.activities.forEach((activity, i) => {
        defs.append("pattern")
          .attr("id", "hatch" + i)
          .attr("width", globTime.config.patternScale)
          .attr("x", globTime.config.patternScale * i)
          .attr("height", globTime.config.patternScale)
          .attr("patternTransform", "rotate(" + globTime.config.patternRotation + ")")
          .attr("patternUnits", "userSpaceOnUse")
          .append("rect")
            .attr("width", globTime.config.patternScale/2)
            .attr("height", globTime.config.patternScale)
            .style("fill", activityColors[activity]);
      })
      timeSum.append("g")
        .attr("transform", "translate(" + width / 2 + ", " + timeSumTranslateY + ")")
        .selectAll("path")
        .data(pieData)
        .join("path")
          .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
          )
          .attr("fill", d => d.data.multi ? "url(#hatch" + sumData.activities.indexOf(d.data.type) + ")" : activityColors[d.data.type])
          .attr("stroke", "none")
          .on("mouseover", (e, d) => {
            tooltip.style.display = null;
            const percent = (d.data.duration.getTime() / sumData.duration * 100).toFixed(2);
            tooltip.innerHTML = d.data.type;
            tooltip.innerHMTL += d.data.multi ? "<br>Multitasking" : "<br>";
            tooltip.innerHTML += "<br>" + parseDuration(d.data.duration) + "<br>" + percent + "%";
            ttip = {w: document.getElementById("tooltip").offsetWidth, h: document.getElementById("tooltip").offsetHeight};
          })
          .on("mouseout", () => {
            tooltip.style.display = "none";
          });
      let text;
      timeSum.append("text")
        .text(() => {
          const duration = parseDuration(new Date(sumData.duration));
          // let from = globTime.storage.startTime;
          // let to = globTime.storage.endTime;
          let from = $("#inputSumFrom").datepicker("getDate");
          let to = $("#inputSumTo").datepicker("getDate");
          if (from.toDateString() === globTime.storage.startTime.toDateString()) {
            from = globTime.storage.startTime;
          }
          if (to.toDateString() === globTime.storage.endTime.toDateString()) {
            to = globTime.storage.endTime;
          } else {
            to = new Date(to.getTime() + 86400000);
          }
          const period = new Date(to.getTime() - from.getTime());
          const percent = (sumData.duration / period.getTime() * 100).toFixed(2);
          text = duration + ", " + percent + "% of selected period";
          return text;
        })
        .attr("x", (e,d) => {
          const textWidth = context.measureText(text);
          return (width - textWidth.width) / 2;
        })
        .attr("y", height - margin.font);
    }
    function updateMultiView() {
      const allMulti = document.querySelectorAll("g.multi");
      const allNonMulti = document.querySelectorAll("g.nonMulti");
      const allTotal = document.querySelectorAll("g.total");
      const multiInput = document.getElementById("buttonMulti").checked;
      if (multiInput) {
        allMulti.forEach(item => {
          item.style.visibility = "visible";
        });
        allNonMulti.forEach(item => {
          item.style.visibility = "visible";
        });
        allTotal.forEach(item => {
          item.style.visibility = "hidden";
        });
      } else {
        allMulti.forEach(item => {
          item.style.visibility = "hidden";
        });
        allNonMulti.forEach(item => {
          item.style.visibility = "hidden";
        });
        allTotal.forEach(item => {
          item.style.visibility = "visible";
        });
      }
      drawTimeSum();
    }

    const data = globTime.storage.data;
    const months = globTime.storage.months;
    const dates = globTime.storage.dates;
    const margin = globTime.config.margin;
    const height = window.innerHeight - globTime.config.headerHeight - globTime.config.scrollBarXHeight - margin.top - margin.bottom;
    const barWidth = globTime.config.barWidth;
    const width = dates.length * barWidth - margin.left - margin.right;
    const tickCount = globTime.config.tickCount;
    const comments = globTime.storage.comments;
    const timeLineMargin = globTime.config.timeLineMargin;
    const d3TimeChart = document.getElementById("d3TimeChart");
    const groups = globTime.storage.groups;
    const activities = globTime.storage.activities;
    const activityColors = globTime.storage.configJson.activityColors;
    const xScale = d3.scaleBand()
      .domain(dates)
      .range([width, 0]);
    const yScale = d3.scaleLinear()
      .domain([0, 86400000])
      .range([0, height]);
    let timeChart;
    const fromDate = new Date(dates[dates.length - 1]);
    const fromString = fromDate.getDate() + "." + (fromDate.getMonth() + 1) + "." + fromDate.getFullYear();
    const toDate = new Date(dates[0]);
    const toString = toDate.getDate() + "." + (toDate.getMonth() + 1) + "." + toDate.getFullYear();
    document.getElementById("fromDate").textContent = fromString;
    document.getElementById("toDate").textContent = toString;
    if (globTime.storage.firstLoad) {
      globTime.storage.firstLoad = false;
      $("#inputSumFrom").datepicker().on("change", e => {
        if ($(e.target).datepicker("getDate") < new Date(globTime.storage.startTime.toDateString())) {
          $(e.target).datepicker("setDate", globTime.storage.startTime)
        }
        drawTimeSum();
      });
      $("#inputSumTo").datepicker().on("change", e => {
        if ($(e.target).datepicker("getDate") > new Date(globTime.storage.endTime.toDateString())) {
          $(e.target).datepicker("setDate", globTime.storage.endTime)
        }
        drawTimeSum();
      });
      document.getElementById("buttonMulti").addEventListener("change", updateMultiView);
    }
    if (firstTime) {
      const oldTimeChart = document.querySelector(".timeChart");
      if (oldTimeChart != undefined) {
        oldTimeChart.remove();
      }
      const oldLegend = document.getElementById("legendActivity");
      if (oldLegend.innerHTML.length > 0) {
        oldLegend.innerHTML = "";
      }
      $("#inputSumFrom").datepicker("setDate", new Date(dates[dates.length - 1]))
      $("#inputSumTo").datepicker("setDate", new Date(dates[0]));
      timeChart = d3.select("#d3TimeChart").append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .attr("class", "timeChart");
      drawLegend();
      drawTimeLine();
      drawChrono();
      drawChronoAxisY();
      const chronoScrollWidth = d3TimeChart.scrollWidth;
      d3TimeChart.scrollLeft = chronoScrollWidth;
      firstTime = false;
    } else {
      timeChart = d3.select("#d3TimeChart .timeChart")
      .attr("height", height + margin.top + margin.bottom);
      if (redraw != undefined && redraw.chrono) {
        drawChrono();
        drawChronoAxisY();
      }
    }
    drawTimeGraph();
    updateMultiView();
    if (currentGraph === "chrono") {
      document.querySelector(".timeChart .graph").style.display = "none";
      document.querySelector("g.timeGraphAxisY").style.display = "none";
      document.getElementById("d3TimeSum").style.display = "none";
    } else if (currentGraph === "graph") {
      document.querySelector(".timeChart .chrono").style.display = "none";
      document.querySelector("g.timeChronoAxisY").style.display = "none";
      document.getElementById("d3TimeSum").style.display = "none";
    } else {
      document.querySelector(".timeChart .chrono").style.display = "none";
      document.querySelector("g.timeChronoAxisY").style.display = "none";
      document.querySelector(".timeChart .graph").style.display = "none";
      document.querySelector("g.timeGraphAxisY").style.display = "none";
    }
  }
  function tooltipPosition(e) {
    const mouse = {x: e.clientX, y: e.clientY};
    tooltip.style.top = (mouse.y - 10 - ttip.h) + "px";
    tooltip.style.left = (mouse.x - ttip.w / 2) + "px";
  }

  /* EVENT LISTENERS */
  if (globTime.storage.firstLoad) {
    document.addEventListener("mousemove", tooltipPosition);
    window.addEventListener("resize", () => {
      prepGround({chrono: true});
    });
    document.getElementById("buttonChrono").addEventListener("change", () => {
      currentGraph = "chrono";
      document.getElementById("d3TimeChart").style.display = "block";
      document.getElementById("timeLeftAxis").style.display = "block";
      document.querySelector(".timeChart g.chrono").style.display = "block";
      document.querySelector("g.timeChronoAxisY").style.display = "block";
      document.querySelector("label[for='inputSumFrom']").style.display = "none";
      document.querySelector("label[for='inputSumTo']").style.display = "none";
      document.querySelector("#inputSumFrom").style.display = "none";
      document.querySelector("#inputSumTo").style.display = "none";
      document.getElementById("d3TimeSum").style.display = "none";
      document.querySelector("label[for='buttonMulti']").style.display = "none";
      document.querySelector(".timeChart g.graph").style.display = "none";
      document.querySelector("g.timeGraphAxisY").style.display = "none";
    });
    document.getElementById("buttonGraph").addEventListener("change", () => {
      currentGraph = "graph";
      document.getElementById("d3TimeChart").style.display = "block";
      document.getElementById("timeLeftAxis").style.display = "block";
      document.querySelector(".timeChart g.graph").style.display = "block";
      document.querySelector("g.timeGraphAxisY").style.display = "block";
      document.querySelector("label[for='buttonMulti']").style.display = "inline-block";
      document.querySelector("label[for='inputSumFrom']").style.display = "none";
      document.querySelector("label[for='inputSumTo']").style.display = "none";
      document.querySelector("#inputSumFrom").style.display = "none";
      document.querySelector("#inputSumTo").style.display = "none";
      document.getElementById("d3TimeSum").style.display = "none";
      document.querySelector(".timeChart g.chrono").style.display = "none";
      document.querySelector("g.timeChronoAxisY").style.display = "none";
    });
    document.getElementById("buttonSum").addEventListener("change", () => {
      currentGraph = "sum";
      document.getElementById("d3TimeSum").style.display = "block";
      document.querySelector("label[for='buttonMulti']").style.display = "inline-block";
      document.querySelector("label[for='inputSumFrom']").style.display = "inline";
      document.querySelector("label[for='inputSumTo']").style.display = "inline";
      document.querySelector("#inputSumFrom").style.display = "inline";
      document.querySelector("#inputSumTo").style.display = "inline";
      document.getElementById("d3TimeChart").style.display = "none";
      document.getElementById("timeLeftAxis").style.display = "none";
    })
  }

  /* TEMPORARY FILE LOADER FOR FASTER DEVELOPMENT */
  async function loadFiles() {
    const configFile = await fetch("/testFiles/logConfig.json");
    const parsedCsv = await d3.csv("/testFiles/totalLog20210911.csv");
    const parsedJson = await configFile.json();
    const verifiedFiles = {
      csv: parsedCsv,
      config: parsedJson
    };
    determineNextActions(verifiedFiles);
  }
  const fast = false;
  if (fast) {
    loadFiles();
  } else {
    /* verifyFiles returns {csv, config} if files are valid,
    returns "error" if not */
    const verifiedFiles = await verifyFiles(files);
    if (verifiedFiles === "error") {
      document.getElementById("openInfoText").textContent = "Open .csv and .json files only and open max. 2 files at once.";
      return;
    }
    determineNextActions(verifiedFiles);
  }
}
function fileDropHandler(e) {
  e.preventDefault();
  files = e.dataTransfer.files;
  document.getElementById("dropIndicator").style.opacity = "0";
  groundMain(files);
}
function fileDragOverHandler(e) {
  e.preventDefault();
  document.getElementById("dropIndicator").style.opacity = "0.5";
}
function scrollFromSpace() {
  document.getElementById("ground").scrollIntoView({behavior: "smooth"});
}

// groundMain();


$("input[type='radio']").checkboxradio({
  icon: false
});
$("#buttonGroups").button();
$("#buttonSunlight").button();
$("#buttonCompare").button();
$("#buttonMulti").button();
document.querySelector("label[for='buttonMulti']").style.display = "none";
$(".configAlert").on("mouseover", () => {
  document.querySelector(".configChanges").style.display = "block";
}).on("mouseout", () => {
  document.querySelector(".configChanges").style.display = "none";
}).on("click", (e) => {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(globTime.storage.configJson));
  e.currentTarget.setAttribute("href",     dataStr     );
  e.currentTarget.setAttribute("download", "config.json");
});
$("#buttonAddFilter").button();
$.datepicker.setDefaults({
  dateFormat: "dd.m.yy"
});
