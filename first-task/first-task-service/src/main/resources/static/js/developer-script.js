function getAllInstantiatedProcessesDeveloper() {
  $("#submissions-table-body").empty();

  // Retrieve all process instances
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
          // retrieve each proccess instance variables
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
              if (
                data !== {} &&
                data.initiator === $("#initiator-input").val()
              ) {
                var application = data.application;
                var initiator = data.initiator;
                var reviewer = data.reviewer;

                if (data.hasOwnProperty("status")){
                var translatedStatus = data.status ? "Accepted" : "Rejected";
                 $("#submissions-table-body").append(
                    "<tr><td>" +
                    application +
                                      "</td><td>" +
                                      reviewer +
                                      "</td><td> " +
                                      translatedStatus +
                                      " </td></tr>"
                                  );

                }

                else
                  $("#submissions-table-body").append(
                    "<tr><td>" +
                      application +
                      "</td><td>" +
                      reviewer +
                      "</td><td> pending </td></tr>"
                  );

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

function instantiateProcessInstanceAndSendApplication() {
  // Retrieve all current proccess instances
  $.ajax({
    type: "POST",
    headers: {
      "X-KIE-ContentType": "application/json",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url:
      baseurl +
      "/containers/" +
      basecontainer +
      "/processes/" +
      process +
      "/instances",
  })
    .done(function (result) {
      var processInstanceId = result;
      // retrieve process  instance current work item
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

          var submitApplicationWorkItemId =
            data["work-item-instance"][0]["work-item-id"];
          var application = $("#application-input").val();
          var reviewer = $("#reviewer-input option:selected").val();
          var initiator = $("#initiator-input").val();
          var postData = {
            outInitiator: initiator,
            outReviewer: reviewer,
            outApplication: application,
          };

          // Submit Application
          $.ajax({
            url:
              baseurl +
              "/containers/" +
              basecontainer +
              "/processes/instances/" +
              processInstanceId +
              "/workitems/" +
              submitApplicationWorkItemId +
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
              getAllInstantiatedProcessesDeveloper();
            })
            .fail(function (xhr) {
              console.log(xhr);
            });
        })
        .fail(function (xhr) {
          console.log("error", xhr);
        });
    })
    .fail(function (e) {
      console.log("ERROR: ", e);
    });
}

$(document).ready(function () {
  getAllInstantiatedProcessesDeveloper();
  $("#submit-btn").click(function () {
    instantiateProcessInstanceAndSendApplication();
  });
});
