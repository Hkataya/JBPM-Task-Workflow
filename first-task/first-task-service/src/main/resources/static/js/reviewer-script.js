function getAllInstantiatedProcessesReviewer() {
  $("#submissions-table-body").empty();

  // retireve all process instances
  $.ajax({
    type: "GET",
    headers: {
      "X-KIE-ContentType": "application/json",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: baseurl + "/queries/processes/" + process + "/instances",
  })
    .done(function (result) {
      if (result["process-instance"].length !== 0) {
        result["process-instance"].forEach(function (instance) {
          var instanceid = instance["process-instance-id"];
          // retireve process instance variables
          $.ajax({
            url:
              baseurl +
              "/containers/" +
              basecontainer +
              "/processes/instances/" +
              instanceid +
              "/variables",
            method: "GET",
            headers: {
              "X-KIE-ContentType": "application/json",
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .done(function (data) {
              if (data !== {} && data.reviewer === $("#reviewer-input").val()) {
                var application = data.application;
                var initiator = data.initiator;
                var reviewer = data.reviewer;
                if (data.hasOwnProperty("status")) {
                var translatedStatus = data.status ? "Accepted" : "Rejected";
                  $("#submissions-table-body").append(
                    "<tr><td>" +
                      initiator +
                      "</td><td>" +
                      application +
                      " </td><td>" +
                      translatedStatus +
                      "</td></tr>"
                  );
                } else {
                  var acceptBtn = $("<button />", {
                    html: "Accept",
                    click: function () {
                      postApplicationReview(instanceid, true);
                    },
                  });

                  acceptBtn.addClass("btn btn-success");
                  var rejectBtn = $("<button />", {
                    html: "Reject",
                    click: function () {
                      postApplicationReview(instanceid, false);
                    },
                  });
                  rejectBtn.addClass("btn btn-danger");

                  var tableRow = $("<tr></tr>");
                  var acceptTableCol = $("<td> </td>");
                  var rejectTableCol = $("<td> </td>");

                  tableRow.append(
                    "<td>" + initiator + "</td><td>" + application + "</td>"
                  );
                  tableRow.append(acceptTableCol.append(acceptBtn));
                  tableRow.append(rejectTableCol.append(rejectBtn));
                  $("#submissions-table-body").append(tableRow);
                }

                $("#empty-submissions-table").hide();
                $("#submissions-table").show();
              }
            })
            .fail(function (xhr) {
              console.log("error", xhr);
            });
        });
      }
    })
    .fail(function (e) {
      console.log("ERROR: ", e);
    });
}
function postApplicationReview(processInstanceId, status) {
  // retrieve current workItem
  $.ajax({
    url:
      baseurl +
      "/containers/" +
      basecontainer +
      "/processes/instances/" +
      processInstanceId +
      "/workitems",
    method: "GET",
    headers: {
      "X-KIE-ContentType": "application/json",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .done(function (data) {
      var reviewApplicationWorkItem =
        data["work-item-instance"][0]["work-item-id"];
      var postData = {
        outStatus: status,
      };

      // Submit review
      $.ajax({
        url:
          baseurl +
          "/containers/" +
          basecontainer +
          "/processes/instances/" +
          processInstanceId +
          "/workitems/" +
          reviewApplicationWorkItem +
          "/completed",
        type: "PUT",
        headers: {
          "X-KIE-ContentType": "application/json",
          Accept: "*/*",
          "Content-Type": "application/json",
          dataType: "text",
        },
        data: JSON.stringify(postData),
      })
        .done(function () {
          $("#exampleModal .close").click();
          getAllInstantiatedProcessesReviewer();
        })
        .fail(function (xhr) {
          console.log(xhr);
        });
    })
    .fail(function (xhr) {
      console.log("error", xhr);
    });
}

$(document).ready(function () {
  getAllInstantiatedProcessesReviewer();
});
