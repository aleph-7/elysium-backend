//Animesh took a big fat dump //
//gross
//will still take more time to complete
//will take a dump again
//will take a dump again
//will take a dump again
//wtf is this shit

const express = require("express");
const router = express.Router();

const sportBooking = require("../../models/bookingsDB").sportBookingsSchema;
const Record = require("../../models/userDB").recordSchema;
const badmintonLeaderboard =
  require("../../models/leaderboardDB").badmintonLeaderboardSchema;
const squashLeaderboard =
  require("../../models/leaderboardDB").squashLeaderboardSchema;
const tabletennisLeaderboard =
  require("../../models/leaderboardDB").tabletennisLeaderboardSchema;
const tennisLeaderboard =
  require("../../models/leaderboardDB").tennisLeaderboardSchema;
const Courts = require("../../models/courtDB").badmintonCourtsSchema;
const Workshops = require("../../models/contentDB").sport_workshopSchema;

router.get("/sport_booking", async (req, res) => {
  let attributeList;
  let workshopslist;
  //get bookings of a specific day!!! TO DO!!!
  let currentDate = new Date().toLocaleDateString("en-GB");
  console.log(currentDate);
  let formattedDate = currentDate.split("/").join("-");
  console.log(formattedDate);

  await sportBooking
    .find({ booking_status: 0, type_of_booking: 0 , date_slot: formattedDate})
    .then((results) => {
      attributeList = results.map((doc) => [
        doc._id,
        doc.show_up_status,
        doc.court_id,
        doc.user_id,
        doc.time_slot,
        doc.type_of_sport,
        doc.time_of_booking,
        doc.booking_status,
        doc.type_of_booking,
        doc.date_slot,
        doc.partners_id,
        doc.no_partners,
      ]);
    });

  for (let i = 0; i < attributeList.length; i++) {
    await Record.findOne({ user_id: attributeList[i][3] })
      .then((foundDocument) => {
        if (foundDocument) {
          //   console.log("Found document:", foundDocument);
          if (foundDocument.acceptances + foundDocument.rejections === 0) {
            attributeList[i].push(0.5);
          } else {
            attributeList[i].push(
              foundDocument.rejections /
                (foundDocument.acceptances + foundDocument.rejections)
            );
          }
        } else {
          //   console.log("Document not found");
        }
      })
      .catch((error) => {
        // console.error("Error finding document:", error);
      });
  }

  //   console.log(attributeList);

  let temp_pairing = [];
  let temp_rest = [];

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < attributeList.length; j++) {
      if (attributeList[j][5] === "badminton" && attributeList[j][4] === i) {
        if (attributeList[j][11] === 0) {
          //contains users that have not been paired yet
          temp_pairing.push(attributeList[j]);
        } else temp_rest.push(attributeList[j]);
      }
    }

    //sorting based on leaderboard position
    temp_pairing.sort(async (a, b) => {
      await badmintonLeaderboard.findOne({ user_id: a[3] }).then(async (A) => {
        console.log(A);
        await badmintonLeaderboard.findOne({ user_id: b[3] }).then((B) => {
          console.log(B);

          if (A === null) a_pos = 1000000;
          else a_pos = A.position;
          if (B === null) b_pos = 1000000;
          else b_pos = B.position;
          return a_pos - b_pos;
          //   a_pos = A.position;
          //   b_pos = B.position;
          //   return a_pos - b_pos;
        });
      });
      //assuming INT_MAX is the maximum possible value of position
      //REVIEW!!!
    });

    //console.log(temp_pairing);

    //to refer to indices of unpaired users later in temp_pairing
    var dict = {};
    for (let k = 0; k + 1 < temp_pairing.length; k += 2) {
      temp_pairing[k][11]++;
      temp_pairing[k + 1][11]++;
      temp_pairing[k][10] = temp_pairing[k + 1][3];
      temp_pairing[k + 1][10] = temp_pairing[k][3];
      temp_rest.push(temp_pairing[k]);
      dict[temp_pairing[k][0]] = k;
      //consider average!!!
    }

    //sort bookings to decide priority
    temp_rest.sort((a, b) => {
      if (a[12] === b[12]) {
        // If 'record' parameters are equal, use 'num_players' as tiebreaker
        return a[11] - b[11];
      }
      //record/history of rejections
      return a[12] - b[12];
    });

    //list of workshops
    await Workshops
    .find({date_slot: formattedDate, type_of_sport: "badminton", time_slot_start: i})
    .then((results) => {
      workshopslist = results.map((doc) => [
        doc._id,
        doc.coach_user_id,
        doc.court_id,
        doc.date_slot,
        doc.type_of_sport,
        doc.time_slot_start,
        doc.time_slot_end,
      ]);
    });

    //list of courts
    let courts;
    await Courts.find({}).then((results) => {
      courts = results.map((doc) => [
        doc._id,
        doc.occupancy_status,
        doc.court_name,
      ]);
    });

    let num_courts = courts.length;
    let counter = 0;

    //assigning courts to workshops
    while (counter < num_courts && counter < workshopslist.length) {
      const conditions = {
        _id: workshopslist[counter][0],
      };
      const update = {
        $set: {
          court_id: courts[counter][0],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
      counter++;
    }

    //assigning null courts for workshops that could not be assigned
    for (let k = counter; k < workshopslist.length; k++) {
      const conditions = {
        _id: workshopslist[k][0],
      };
      const update = {
        $set: {
          court_id: null,
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
    }


    let size = temp_rest.length;

    //changing attributes of temp_rest list and adding other bookings to the list
    for (let i = 0; i < size; i++) {
      if (i >= size - courts.length + counter) {
        //accepting bookings from right/having higher priority
        temp_rest[i][7] = 1;
        temp_rest[i][2] = courts[size - i - 1 + counter][0];
        if (temp_rest[i][11] === 0) {
          //newly paired user
          temp_rest[i][10].push(temp_pairing[dict[temp_rest[i][0]] + 1][0]);
          temp_rest[i][11] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][2] = courts[size - i - 1 + counter][0];
          temp_pairing[dict[temp_rest[i][0]] + 1][10].push(temp_rest[i][0]);
          temp_pairing[dict[temp_rest[i][0]] + 1][11] = 1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      } else {
        //rejecting all other bookings
        temp_rest[i][7] = -1;
        if (temp_rest[i][11] === 0) {
          //rejecting bookings that were paired
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = -1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      }
    }

    if (temp_pairing.length % 2 === 1) {
      //rejecting booking that could not be not paired
      temp_pairing[temp_pairing.length - 1][7] = -1;
      temp_rest.push(temp_pairing[temp_pairing.length - 1]);
    }

    //console.log(temp_rest);
    size = temp_rest.length;

    //updating the sport_booking database
    for (let i = 0; i < size; i++) {
      const conditions = {
        _id: temp_rest[i][0],
      };
      const update = {
        $set: {
          booking_status: temp_rest[i][7],
          court_id: temp_rest[i][2],
          partners_id: temp_rest[i][10],
          no_partners: temp_rest[i][11],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      sportBooking
        .findOneAndUpdate(conditions, update, options)
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    }

    //updating the records database
    for (let i = 0; i < size; i++) {
      if (temp_rest[i][7] === 1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { acceptances: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
      if (temp_rest[i][7] === -1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { rejections: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
    }

    temp_pairing = [];
    temp_rest = [];
    workshopslist = [];
  }


  //tennis
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < attributeList.length; j++) {
      if (attributeList[j][5] === "tennis" && attributeList[j][4] === i) {
        if (attributeList[j][11] === 0) {
          //contains users that have not been paired yet
          temp_pairing.push(attributeList[j]);
        } else temp_rest.push(attributeList[j]);
      }
    }

    //sorting based on leaderboard position
    temp_pairing.sort(async (a, b) => {
      await tennisLeaderboard.findOne({ user_id: a[3] }).then(async (A) => {
        console.log(A);
        await tennisLeaderboard.findOne({ user_id: b[3] }).then((B) => {
          console.log(B);

          if (A === null) a_pos = 1000000;
          else a_pos = A.position;
          if (B === null) b_pos = 1000000;
          else b_pos = B.position;
          return a_pos - b_pos;
          //   a_pos = A.position;
          //   b_pos = B.position;
          //   return a_pos - b_pos;
        });
      });
      //assuming INT_MAX is the maximum possible value of position
      //REVIEW!!!
    });

    //console.log(temp_pairing);

    //to refer to indices of unpaired users later in temp_pairing
    var dict = {};
    for (let k = 0; k + 1 < temp_pairing.length; k += 2) {
      temp_rest.push(temp_pairing[k]);
      dict[temp_pairing[k][0]] = k;
      //consider average!!!
    }

    //sort bookings to decide priority
    temp_rest.sort((a, b) => {
      if (a[12] === b[12]) {
        // If 'record' parameters are equal, use 'num_players' as tiebreaker
        return a[11] - b[11];
      }
      //record/history of rejections
      return a[12] - b[12];
    });

    //list of workshops
    await Workshops
    .find({date_slot: formattedDate, type_of_sport: "tennis", time_slot_start: i})
    .then((results) => {
      workshopslist = results.map((doc) => [
        doc._id,
        doc.coach_user_id,
        doc.court_id,
        doc.date_slot,
        doc.type_of_sport,
        doc.time_slot_start,
        doc.time_slot_end,
      ]);
    });

    //list of courts
    let courts;
    await Courts.find({}).then((results) => {
      courts = results.map((doc) => [
        doc._id,
        doc.occupancy_status,
        doc.court_name,
      ]);
    });

    let num_courts = courts.length;
    let counter = 0;

    //assigning courts to workshops
    while (counter < num_courts && counter < workshopslist.length) {
      const conditions = {
        _id: workshopslist[counter][0],
      };
      const update = {
        $set: {
          court_id: courts[counter][0],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
      counter++;
    }

    //assigning null courts for workshops that could not be assigned
    for (let k = counter; k < workshopslist.length; k++) {
      const conditions = {
        _id: workshopslist[k][0],
      };
      const update = {
        $set: {
          court_id: null,
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
    }


    let size = temp_rest.length;

    //changing attributes of temp_rest list and adding other bookings to the list
    for (let i = 0; i < size; i++) {
      if (i >= size - courts.length + counter) {
        //accepting bookings from right/having higher priority
        temp_rest[i][7] = 1;
        temp_rest[i][2] = courts[size - i - 1 + counter][0];
        if (temp_rest[i][11] === 0) {
          //newly paired user
          temp_rest[i][10].push(temp_pairing[dict[temp_rest[i][0]] + 1][0]);
          temp_rest[i][11] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][2] = courts[size - i - 1 + counter][0];
          temp_pairing[dict[temp_rest[i][0]] + 1][10].push(temp_rest[i][0]);
          temp_pairing[dict[temp_rest[i][0]] + 1][11] = 1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      } else {
        //rejecting all other bookings
        temp_rest[i][7] = -1;
        if (temp_rest[i][11] === 0) {
          //rejecting bookings that were paired
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = -1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      }
    }

    if (temp_pairing.length % 2 === 1) {
      //rejecting booking that could not be not paired
      temp_pairing[temp_pairing.length - 1][7] = -1;
      temp_rest.push(temp_pairing[temp_pairing.length - 1]);
    }

    //console.log(temp_rest);
    size = temp_rest.length;

    //updating the sport_booking database
    for (let i = 0; i < size; i++) {
      const conditions = {
        _id: temp_rest[i][0],
      };
      const update = {
        $set: {
          booking_status: temp_rest[i][7],
          court_id: temp_rest[i][2],
          partners_id: temp_rest[i][10],
          no_partners: temp_rest[i][11],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      sportBooking
        .findOneAndUpdate(conditions, update, options)
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    }

    //updating the records database
    for (let i = 0; i < size; i++) {
      if (temp_rest[i][7] === 1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { acceptances: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
      if (temp_rest[i][7] === -1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { rejections: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
    }

    temp_pairing = [];
    temp_rest = [];
    workshopslist = [];
  }

  //squash
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < attributeList.length; j++) {
      if (attributeList[j][5] === "squash" && attributeList[j][4] === i) {
        if (attributeList[j][11] === 0) {
          //contains users that have not been paired yet
          temp_pairing.push(attributeList[j]);
        } else temp_rest.push(attributeList[j]);
      }
    }

    //sorting based on leaderboard position
    temp_pairing.sort(async (a, b) => {
      await squashLeaderboard.findOne({ user_id: a[3] }).then(async (A) => {
        console.log(A);
        await squashLeaderboard.findOne({ user_id: b[3] }).then((B) => {
          console.log(B);

          if (A === null) a_pos = 1000000;
          else a_pos = A.position;
          if (B === null) b_pos = 1000000;
          else b_pos = B.position;
          return a_pos - b_pos;
          //   a_pos = A.position;
          //   b_pos = B.position;
          //   return a_pos - b_pos;
        });
      });
      //assuming INT_MAX is the maximum possible value of position
      //REVIEW!!!
    });

    //console.log(temp_pairing);

    //to refer to indices of unpaired users later in temp_pairing
    var dict = {};
    for (let k = 0; k + 1 < temp_pairing.length; k += 2) {
      temp_rest.push(temp_pairing[k]);
      dict[temp_pairing[k][0]] = k;
      //consider average!!!
    }

    //sort bookings to decide priority
    temp_rest.sort((a, b) => {
      if (a[12] === b[12]) {
        // If 'record' parameters are equal, use 'num_players' as tiebreaker
        return a[11] - b[11];
      }
      //record/history of rejections
      return a[12] - b[12];
    });

    //list of workshops
    await Workshops
    .find({date_slot: formattedDate, type_of_sport: "squash", time_slot_start: i})
    .then((results) => {
      workshopslist = results.map((doc) => [
        doc._id,
        doc.coach_user_id,
        doc.court_id,
        doc.date_slot,
        doc.type_of_sport,
        doc.time_slot_start,
        doc.time_slot_end,
      ]);
    });

    //list of courts
    let courts;
    await Courts.find({}).then((results) => {
      courts = results.map((doc) => [
        doc._id,
        doc.occupancy_status,
        doc.court_name,
      ]);
    });

    let num_courts = courts.length;
    let counter = 0;

    //assigning courts to workshops
    while (counter < num_courts && counter < workshopslist.length) {
      const conditions = {
        _id: workshopslist[counter][0],
      };
      const update = {
        $set: {
          court_id: courts[counter][0],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
      counter++;
    }

    //assigning null courts for workshops that could not be assigned
    for (let k = counter; k < workshopslist.length; k++) {
      const conditions = {
        _id: workshopslist[k][0],
      };
      const update = {
        $set: {
          court_id: null,
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
    }


    let size = temp_rest.length;

    //changing attributes of temp_rest list and adding other bookings to the list
    for (let i = 0; i < size; i++) {
      if (i >= size - courts.length + counter) {
        //accepting bookings from right/having higher priority
        temp_rest[i][7] = 1;
        temp_rest[i][2] = courts[size - i - 1 + counter][0];
        if (temp_rest[i][11] === 0) {
          //newly paired user
          temp_rest[i][10].push(temp_pairing[dict[temp_rest[i][0]] + 1][0]);
          temp_rest[i][11] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][2] = courts[size - i - 1 + counter][0];
          temp_pairing[dict[temp_rest[i][0]] + 1][10].push(temp_rest[i][0]);
          temp_pairing[dict[temp_rest[i][0]] + 1][11] = 1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      } else {
        //rejecting all other bookings
        temp_rest[i][7] = -1;
        if (temp_rest[i][11] === 0) {
          //rejecting bookings that were paired
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = -1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      }
    }

    if (temp_pairing.length % 2 === 1) {
      //rejecting booking that could not be not paired
      temp_pairing[temp_pairing.length - 1][7] = -1;
      temp_rest.push(temp_pairing[temp_pairing.length - 1]);
    }

    //console.log(temp_rest);
    size = temp_rest.length;

    //updating the sport_booking database
    for (let i = 0; i < size; i++) {
      const conditions = {
        _id: temp_rest[i][0],
      };
      const update = {
        $set: {
          booking_status: temp_rest[i][7],
          court_id: temp_rest[i][2],
          partners_id: temp_rest[i][10],
          no_partners: temp_rest[i][11],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      sportBooking
        .findOneAndUpdate(conditions, update, options)
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    }

    //updating the records database
    for (let i = 0; i < size; i++) {
      if (temp_rest[i][7] === 1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { acceptances: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
      if (temp_rest[i][7] === -1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { rejections: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
    }

    temp_pairing = [];
    temp_rest = [];
    workshopslist = [];
  }

  //table tennis
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < attributeList.length; j++) {
      if (attributeList[j][5] === "table_tennis" && attributeList[j][4] === i) {
        if (attributeList[j][11] === 0) {
          //contains users that have not been paired yet
          temp_pairing.push(attributeList[j]);
        } else temp_rest.push(attributeList[j]);
      }
    }

    //sorting based on leaderboard position
    temp_pairing.sort(async (a, b) => {
      await tabletennisLeaderboard.findOne({ user_id: a[3] }).then(async (A) => {
        console.log(A);
        await tabletennisLeaderboard.findOne({ user_id: b[3] }).then((B) => {
          console.log(B);

          if (A === null) a_pos = 1000000;
          else a_pos = A.position;
          if (B === null) b_pos = 1000000;
          else b_pos = B.position;
          return a_pos - b_pos;
          //   a_pos = A.position;
          //   b_pos = B.position;
          //   return a_pos - b_pos;
        });
      });
      //assuming INT_MAX is the maximum possible value of position
      //REVIEW!!!
    });

    //console.log(temp_pairing);

    //to refer to indices of unpaired users later in temp_pairing
    var dict = {};
    for (let k = 0; k + 1 < temp_pairing.length; k += 2) {
      temp_rest.push(temp_pairing[k]);
      dict[temp_pairing[k][0]] = k;
      //consider average!!!
    }

    //sort bookings to decide priority
    temp_rest.sort((a, b) => {
      if (a[12] === b[12]) {
        // If 'record' parameters are equal, use 'num_players' as tiebreaker
        return a[11] - b[11];
      }
      //record/history of rejections
      return a[12] - b[12];
    });

    //list of workshops
    await Workshops
    .find({date_slot: formattedDate, type_of_sport: "table_tennis", time_slot_start: i})
    .then((results) => {
      workshopslist = results.map((doc) => [
        doc._id,
        doc.coach_user_id,
        doc.court_id,
        doc.date_slot,
        doc.type_of_sport,
        doc.time_slot_start,
        doc.time_slot_end,
      ]);
    });

    //list of courts
    let courts;
    await Courts.find({}).then((results) => {
      courts = results.map((doc) => [
        doc._id,
        doc.occupancy_status,
        doc.court_name,
      ]);
    });

    let num_courts = courts.length;
    let counter = 0;

    //assigning courts to workshops
    while (counter < num_courts && counter < workshopslist.length) {
      const conditions = {
        _id: workshopslist[counter][0],
      };
      const update = {
        $set: {
          court_id: courts[counter][0],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
      counter++;
    }

    //assigning null courts for workshops that could not be assigned
    for (let k = counter; k < workshopslist.length; k++) {
      const conditions = {
        _id: workshopslist[k][0],
      };
      const update = {
        $set: {
          court_id: null,
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      Workshops
      .findOneAndUpdate(conditions, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("Updated document:", updatedDocument);
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
    }


    let size = temp_rest.length;

    //changing attributes of temp_rest list and adding other bookings to the list
    for (let i = 0; i < size; i++) {
      if (i >= size - courts.length + counter) {
        //accepting bookings from right/having higher priority
        temp_rest[i][7] = 1;
        temp_rest[i][2] = courts[size - i - 1 + counter][0];
        if (temp_rest[i][11] === 0) {
          //newly paired user
          temp_rest[i][10].push(temp_pairing[dict[temp_rest[i][0]] + 1][0]);
          temp_rest[i][11] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = 1;
          temp_pairing[dict[temp_rest[i][0]] + 1][2] = courts[size - i - 1 + counter][0];
          temp_pairing[dict[temp_rest[i][0]] + 1][10].push(temp_rest[i][0]);
          temp_pairing[dict[temp_rest[i][0]] + 1][11] = 1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      } else {
        //rejecting all other bookings
        temp_rest[i][7] = -1;
        if (temp_rest[i][11] === 0) {
          //rejecting bookings that were paired
          temp_pairing[dict[temp_rest[i][0]] + 1][7] = -1;
          temp_rest.push(temp_pairing[dict[temp_rest[i][0]] + 1]);
        }
      }
    }

    if (temp_pairing.length % 2 === 1) {
      //rejecting booking that could not be not paired
      temp_pairing[temp_pairing.length - 1][7] = -1;
      temp_rest.push(temp_pairing[temp_pairing.length - 1]);
    }

    //console.log(temp_rest);
    size = temp_rest.length;

    //updating the sport_booking database
    for (let i = 0; i < size; i++) {
      const conditions = {
        _id: temp_rest[i][0],
      };
      const update = {
        $set: {
          booking_status: temp_rest[i][7],
          court_id: temp_rest[i][2],
          partners_id: temp_rest[i][10],
          no_partners: temp_rest[i][11],
        },
      };
      const options = {
        new: true, // Return the modified document rather than the original
      };
      sportBooking
        .findOneAndUpdate(conditions, update, options)
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    }

    //updating the records database
    for (let i = 0; i < size; i++) {
      if (temp_rest[i][7] === 1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { acceptances: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
      if (temp_rest[i][7] === -1) {
        const conditions = {
          _id: temp_rest[i][0],
        };
        const update = {
          $inc: { rejections: 1 },
        };
        const options = {
          new: true, // Return the modified document rather than the original
        };
        Record.findOneAndUpdate(conditions, update, options)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated document:", updatedDocument);
            } else {
              console.log("Document not found");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
    }

    temp_pairing = [];
    temp_rest = [];
    workshopslist = [];
  }


  res.json({ message: attributeList });
});

module.exports = router;
