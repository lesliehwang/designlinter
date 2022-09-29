import * as React from "react";

function TotalErrorCount(props) {
  // console.log("*** in TotalErrorCount ***")
  let totalErrorCount = props.errorArray.length;

  return (
    <React.Fragment>
      {totalErrorCount > 0 ? (
        <div className="totals-row">
          <div className="section-title">Error Count</div>
          <span className="error-count">{totalErrorCount}</span>
        </div>
      ) : (
        <div className="totals-row totals-row--success">
          <div className="section-title">
            {" "}
            🎉 Yay! No errors in the selection.
          </div>
          <span className="error-count success">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path
                d="M3.81353 7.88964L0.968732 4.78002L0 5.83147L3.81353 10L12 1.05145L11.0381 0L3.81353 7.88964Z"
                fill="white"
              />
            </svg>
          </span>
        </div>
      )}
    </React.Fragment>
  );
}

export default TotalErrorCount;
