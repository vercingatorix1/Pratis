let featureNames = [];
let userStories = [];

// Function to generate options for feature name select element
function generateFeatureNameOptions() {
  let featureNameSelect = document.getElementById('featureName');

  while (featureNameSelect.firstChild) {
    featureNameSelect.firstChild.remove();
  }

  let noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = 'None';
  featureNameSelect.appendChild(noneOption);

  featureNames.forEach(function(feature) {
    let option = document.createElement('option');
    option.value = feature.name;
    option.textContent = `${feature.name}, Backlogcount ${feature.backlogCount}, Featurecount ${feature.featureCount}`;
    featureNameSelect.appendChild(option);
  });
}

// Function to generate options for depends on select element
function generateDependsOnOptions() {
  let dependsOnSelect = document.getElementById('dependsOn');

  while (dependsOnSelect.firstChild) {
    dependsOnSelect.firstChild.remove();
  }

  let noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = 'None';
  dependsOnSelect.appendChild(noneOption);

  userStories.forEach(function(story) {
    let option = document.createElement('option');
    option.value = story.name;
    option.textContent = story.name;
    dependsOnSelect.appendChild(option);
  });
}

function showAddUserStoryForm() {
  document.getElementById('storyForm').style.display = 'block';
  document.getElementById('backlogPriority').value = backlogUserStoryCount;
}

function showAddFeatureForm() {
  document.getElementById('featureForm').style.display = 'block';
  document.getElementById('featurebacklogPriority').value = backlogUserStoryCount;
}

let teamMemberUserStoryHeight = {
  jokic: 0,
  giannis: 0,
  lebron: 0,
  ausar: 0,
  tyresse: 0
};



let featureUserStoryCount = {};
let backlogUserStoryCount = 1;

function handleAddFeatureFormSubmission(event) {
  event.preventDefault();

  let featureName = document.getElementById('newFeatureName').value;
  let backlogPriority = parseInt(document.getElementById('featurebacklogPriority').value) || backlogUserStoryCount;

  let feature = {
    name: featureName,
    backlogCount: backlogPriority,
    featureCount: 1
  };

  featureNames.push(feature);

  document.getElementById('addFeatureForm').reset();
  document.getElementById('featureForm').style.display = 'none';

  generateFeatureNameOptions();

  backlogUserStoryCount++;
}

function handleAddUserStoryFormSubmission(event) {
  console.log('handleAddUserStoryFormSubmission called');
  event.preventDefault();

  let name = document.getElementById('name').value;
  let assignee = document.getElementById('assignee').value;
  let points = parseInt(document.getElementById('points').value);
  let featureName = document.getElementById('featureName').value;
  let dependsOn = document.getElementById('dependsOn').value;
  let backlogPriority = parseInt(document.getElementById('backlogPriority').value) || backlogUserStoryCount;
  let dependsOnLabel = (dependsOn !== 'None') ? dependsOn : 'None';

  if (name && assignee && points) {
    let teamMember = document.querySelector('.teamMember.' + assignee);
    let capacity = parseInt(teamMember.getAttribute('data-points'));
    let teamMemberHeight = teamMemberUserStoryHeight[assignee];

    // Find the minimum bottom value among the dependencies
    let dependsOnUserStory = null;
    if (dependsOn !== 'None') {
      dependsOnUserStory = userStories.find(function(story) {
        return story.name === dependsOn;
      });
    }

    let minY = teamMemberHeight;

    if (dependsOnUserStory) {
      let userStoryNames = document.querySelectorAll('.userStoryName');
      for (let i = 0; i < userStoryNames.length; i++) {
        let userStoryName = userStoryNames[i];
        if (userStoryName.textContent.includes(dependsOnUserStory.name)) {
          let dependsOnUserStoryElement = userStoryName.parentNode;
          let storyBottom = parseInt(dependsOnUserStoryElement.style.bottom);
          let storyHeight = parseInt(dependsOnUserStoryElement.style.height);

          if (storyBottom + storyHeight > minY && storyBottom + storyHeight > teamMemberHeight) {
            minY = storyBottom + storyHeight;
          } else {
            minY = Math.max(minY, teamMemberHeight);
            
          }
          break;
        }
      }
    }

    let userStory = document.createElement('div');
    userStory.className = 'userStory';
    userStory.style.width = (capacity * 10) + 'px';
    userStory.style.height = (points * 1000) / capacity + 'px';
    userStory.style.bottom = minY + 'px';

    let featurePriority = 0;

    if (featureName === 'None') {
      featurePriority = 0;
    } else {
      let selectedFeature = featureNames.find(function(feature) {
        return feature.name === featureName;
      });

      if (selectedFeature) {
        selectedFeature.featureCount++;
        featurePriority = selectedFeature.featureCount - 1;
      }
    }

    userStory.innerHTML = `
    <div class="userStoryName">Name: ${name}</div>
    <div class="featureName">Feature Name: ${featureName}</div>
    <div class="featurePriority">Feature Priority: ${featurePriority}</div>
    <div class="backlogPriority">Backlog Priority: ${backlogPriority}</div>
    <div class="dependsOnLabel">Depends On: ${dependsOnLabel}</div>
    `;
    console.log('minY:', minY + (points * 1000) / capacity);
    console.log('teamMemberUserStoryHeight[assignee]:', teamMemberUserStoryHeight[assignee]);
    console.log(dependsOn == 'none')
    if (dependsOn == 'none') {
      teamMemberUserStoryHeight[assignee] += (points * 1000) / capacity;
    } else {
      teamMemberUserStoryHeight[assignee] += (points * 1000) / capacity;
    }
    

    console.log('minY:', minY + (points * 1000) / capacity);
    console.log('teamMemberUserStoryHeight[assignee]:', teamMemberUserStoryHeight[assignee]);

    teamMember.appendChild(userStory);
  
    document.getElementById('addStoryForm').reset();

    userStories.push({
      name: name,
      dependentStories: []
    });

    generateFeatureNameOptions();
    generateDependsOnOptions();

    document.getElementById('storyForm').style.display = 'none';

    featureUserStoryCount++;
    backlogUserStoryCount++;

    if (dependsOnUserStory) {
      dependsOnUserStory.dependentStories.push(name);
    }
  }
}

/*
function getNextWorkingDay(date) {
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 0) {
    return "Sunday";
  } else if (dayOfWeek === 6) {
    return "Saturday";
  }

  return date;
}

function countWeekendDays() {
  const today = new Date();
  let count = 0;

  for (let i = 0; i < 10; i++) {
    const nextWorkingDay = getNextWorkingDay(new Date(today.getTime() + i * 24 * 60 * 60 * 1000));
    
    if (nextWorkingDay === "Saturday" || nextWorkingDay === "Sunday") {
      count++;
    }
  }

  return count;
}

const weekendDayCount = countWeekendDays();
console.log("Number of weekend days in the next 10 working days:", weekendDayCount);


function addDates() {
  const datesContainer = document.getElementById('datesContainer');
  const today = new Date();
  const count = countWeekendDays(); // Calculate the weekend day count


  for (let i = 10 + count; i >= 0; i--) {
    const nextWorkingDay = getNextWorkingDay(new Date(today.getTime() + i * 24 * 60 * 60 * 1000));
    
    if (nextWorkingDay !== "Sunday" && nextWorkingDay !== "Saturday") {
      const dateElement = document.createElement('div');
      dateElement.className = 'date';
      dateElement.style.height = `100px`;
      
      const dateText = nextWorkingDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateElement.innerText = dateText;
      datesContainer.appendChild(dateElement);
    }
  }
}



*/

document.addEventListener('DOMContentLoaded', function() {
  generateFeatureNameOptions();
  generateDependsOnOptions();
   //function from 
});

document.getElementById('addStoryButton').addEventListener('click', showAddUserStoryForm);
document.getElementById('addFeatureButton').addEventListener('click', showAddFeatureForm);
document.getElementById('addFeatureForm').addEventListener('submit', handleAddFeatureFormSubmission);
document.getElementById('addStoryForm').addEventListener('submit', handleAddUserStoryFormSubmission);