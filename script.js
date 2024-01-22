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
  let dependsOnLabel = (dependsOn !== 'none') ? dependsOn : 'None';

  if (name && assignee && points) {
    let teamMember = document.querySelector('.teamMember.' + assignee);
    let capacity = parseInt(teamMember.getAttribute('data-points'));
    let teamMemberHeight = teamMemberUserStoryHeight[assignee];

    // Find the minimum bottom value among the dependencies
    let dependsOnUserStory = null;
    if (dependsOn !== 'none') {
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
          let storyTop = parseInt(dependsOnUserStoryElement.style.bottom);
          let storyHeight = parseInt(dependsOnUserStoryElement.style.height);

          if (storyTop + storyHeight > minY) {
            minY = storyTop + storyHeight;
            
            if (minY < teamMemberHeight) {
              minY = teamMemberHeight;

              console.log(minY)
              console.log(storyTop)
              console.log(storyHeight)
              console.log(teamMemberHeight)
            }
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

    if (featureName === 'none') {
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

    teamMemberUserStoryHeight[assignee] = minY + (points * 1000) / capacity;

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


function getNextWorkingDay(date) {
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    date.setDate(date.getDate() + (8 - dayOfWeek));
  }

  return date;
}

document.addEventListener('DOMContentLoaded', function() {
  generateFeatureNameOptions();
  generateDependsOnOptions();
});

function addDates() {
  const datesContainer = document.getElementById('datesContainer');
  const today = new Date();

  for (let i = 9; i >= 0; i--) {
    const dateElement = document.createElement('div');
    dateElement.className = 'date';
    dateElement.style.height = `100px`;
    dateElement.innerText = getNextWorkingDay(new Date(today.getTime() + i * 24 * 60 * 60 * 1000))
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    datesContainer.appendChild(dateElement);
  }
}

addDates();

document.getElementById('addStoryButton').addEventListener('click', showAddUserStoryForm);
document.getElementById('addFeatureButton').addEventListener('click', showAddFeatureForm);
document.getElementById('addFeatureForm').addEventListener('submit', handleAddFeatureFormSubmission);
document.getElementById('addStoryForm').addEventListener('submit', handleAddUserStoryFormSubmission);