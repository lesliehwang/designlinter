import * as React from "react";
import BulkErrorList from "./BulkErrorList";
import TotalErrorCount from "./TotalErrorCount";
import { useState } from "react";

//props: the sections to apply
function Filter(props) {
  // console.log("*** in Filter ***")
  const [colorCheckbox, setIsColorChecked] = useState(false);
  const [strokeCheckbox, setIsStrokeChecked] = useState(false);
  const [typeCheckbox, setIsTypeChecked] = useState(false);
  const [effectsCheckbox, setIsEffectsChecked] = useState(false);
  const [radiusCheckbox, setIsRadiusChecked] = useState(false);

  const [allCheckbox, setIsAllChecked] = useState(false);

  const handleChangeColor = () => {
    setIsColorChecked(!colorCheckbox);
    setIsAllChecked(false);
  };
  const handleChangeStroke = () => {
    setIsStrokeChecked(!strokeCheckbox);
    setIsAllChecked(false);
  };
  const handleChangeType = () => {
    setIsTypeChecked(!typeCheckbox);
    setIsAllChecked(false);
  };
  const handleChangeEffects = () => {
    setIsEffectsChecked(!effectsCheckbox);
    setIsAllChecked(false);
  };
  const handleChangeRadius = () => {
    setIsRadiusChecked(!radiusCheckbox);
    setIsAllChecked(false);
  };
  const handleChangeAll = () => {
    setIsAllChecked(!allCheckbox);
    setIsColorChecked(false);
    setIsStrokeChecked(false);
    setIsTypeChecked(false);
    setIsEffectsChecked(false);
    setIsRadiusChecked(false);
  };

  let filteredErrorArray = props.errorArray.filter(
    item => item.errors.length >= 1
  );

  //handling errors that user selected 'Ignore' for previously
  filteredErrorArray.forEach(item => {
    // Check each layer/node to see if an error that matches it's layer id
    if (props.ignoredErrorArray.some(x => x.node.id === item.id)) {
      // When we know a matching error exists loop over all the ignored
      // errors until we find it.
      props.ignoredErrorArray.forEach(ignoredError => {
        if (ignoredError.node.id === item.id) {
          // Loop over every error in this layer/node until we find the
          // error that should be ignored, then remove it.
          for (let i = 0; i < item.errors.length; i++) {
            if (item.errors[i].value === ignoredError.value) {
              item.errors.splice(i, 1);
              i--;
            }
          }
        }
      });
    }
  });

  let bulkErrorList = [];
  let bulkErrorListToPass = [];

  // Create the list we'll use to display all the errors in bulk.
  filteredErrorArray.forEach(item => {
    let nodeErrors = item.errors;

    nodeErrors.forEach(error => {
      // Check to see if another error with this same value exists.
      if (bulkErrorList.some(e => e.value === error.value)) {
        //FOR ALL THE ERRRORS
        // Find the error of this type that already exists.
        let duplicateError = bulkErrorList.find(e => e.value === error.value);
        let nodesThatShareErrors = duplicateError.nodes;
        // Add the nodes id that share this error to the object
        // That way we can select them all at once.
        nodesThatShareErrors.push(error.node.id);
        duplicateError.nodes = nodesThatShareErrors;
        duplicateError.count = duplicateError.nodes.length;
      } else {
        // If this is the first instance of this type of error, add it to the list.
        error.nodes = [error.node.id];
        error.count = 0;
        bulkErrorList.push(error);
      }
    });
  });

  bulkErrorList.sort((a, b) => b.count - a.count);
  //console.log(bulkErrorList);

  //COLOR
  if (colorCheckbox == true) {
    for (let j = 0; j < bulkErrorList.length; j++) {
      if (bulkErrorList[j].type == "fill") {
        bulkErrorListToPass.push(bulkErrorList[j]);
      }
    }
  }
  //STROKE
  if (strokeCheckbox == true) {
    for (let j = 0; j < bulkErrorList.length; j++) {
      if (bulkErrorList[j].type == "stroke") {
        bulkErrorListToPass.push(bulkErrorList[j]);
      }
    }
  }
  //TYPE
  if (typeCheckbox == true) {
    for (let j = 0; j < bulkErrorList.length; j++) {
      if (bulkErrorList[j].type == "text") {
        bulkErrorListToPass.push(bulkErrorList[j]);
      }
    }
  }
  //EFFECTS
  if (effectsCheckbox == true) {
    for (let j = 0; j < bulkErrorList.length; j++) {
      if (bulkErrorList[j].type == "effects") {
        bulkErrorListToPass.push(bulkErrorList[j]);
      }
    }
  }
  //RADIUS
  if (radiusCheckbox == true) {
    for (let j = 0; j < bulkErrorList.length; j++) {
      if (bulkErrorList[j].type == "radius") {
        bulkErrorListToPass.push(bulkErrorList[j]);
      }
    }
  }
  //ALL
  if (allCheckbox == true) {
    bulkErrorListToPass = bulkErrorList;
  }

  return (
    <div>
      <div className="flex-container filter">
        <div className="instructions"></div>



        <label className="all">
          <input type="checkbox" checked={allCheckbox} onChange={handleChangeAll} name="tag" value="all" /> <span className="tag">All</span>
        </label>
        <div id="filter-divider">|</div>

        <label className="fill">
          <input type="checkbox" checked={colorCheckbox} onChange={handleChangeColor} name="tag" value="fill" /><span className="tag">Fill</span>
        </label>

        <label className="stroke">
          <input type="checkbox" checked={strokeCheckbox} onChange={handleChangeStroke} name="tag" value="stroke" /><span className="tag">Stroke</span>
        </label>

        <label className="typography">
          <input type="checkbox" checked={typeCheckbox} onChange={handleChangeType} name="tag" value="typography" /><span className="tag">Typography</span>
        </label>

        <label className="effects">
          <input type="checkbox" checked={effectsCheckbox} onChange={handleChangeEffects} name="tag" value="effects" /><span className="tag">Effects</span>
        </label>

        <label className="radius">
          <input type="checkbox" checked={radiusCheckbox} onChange={handleChangeRadius} name="tag" value="radius" /><span className="tag">Radius</span>
        </label>

        {/* 
          <input
            type="checkbox"
            className="allTest"
            checked={allCheckbox}
            onChange={handleChangeAll}
          /> <span>ALL!!</span> 

        <input
          type="checkbox"
          checked={colorCheckbox}
          onChange={handleChangeColor}
        /> <span>COLOR!!</span>

        <div className="checkbox-element">
          <input
            type="checkbox"
            checked={allCheckbox}
            onChange={handleChangeAll}
          />
          <label> ALL</label>
        </div>

        <div className="checkbox-element">
          <input
            type="checkbox"
            checked={colorCheckbox}
            onChange={handleChangeColor}
          />
          <label> Color</label>
        </div>

        <div className="checkbox-element">
          <input
            type="checkbox"
            checked={strokeCheckbox}
            onChange={handleChangeStroke}
          />
          <label> Stroke</label>
        </div>

        <div className="checkbox-element">
          <input
            type="checkbox"
            checked={typeCheckbox}
            onChange={handleChangeType}
          />
          <label> Typography</label>
        </div>

        <div className="checkbox-element">
          <input
            type="checkbox"
            checked={effectsCheckbox}
            onChange={handleChangeEffects}
          />
          <label> Effects</label>
        </div>

        <div className="checkbox-element">
          <input
            type="checkbox"
            checked={radiusCheckbox}
            onChange={handleChangeRadius}
          />
          <label> Radius</label>
        </div> */}

      </div>
      <div className="bulk-errors-list">
        <BulkErrorList
          errorArray={bulkErrorListToPass}
          ignoredErrorArray={props.ignoredErrorArray}
          onIgnoredUpdate={props.updateIgnoredErrors}
          onIgnoreAll={props.ignoreAll}
          ignoredErrors={props.ignoredErrorArray}
          onClick={props.updateVisibility}
          onSelectedListUpdate={props.updateSelectedList}
        />
      </div>

      <div className="footer sticky-footer">
        <TotalErrorCount errorArray={filteredErrorArray} />
      </div>
    </div>
  );
}

export default Filter;
