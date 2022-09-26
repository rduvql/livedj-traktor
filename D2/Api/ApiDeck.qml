import CSI 1.0
import QtQuick 2.0
import "ApiClient.js" as ApiClient

Item {
  property int       deckId:  0

  readonly property string    deckLetter:  String.fromCharCode(65 + deckId)
  readonly property string    pathPrefix:  "app.traktor.decks." + (deckId+1) + "."
  readonly property string    deckpathPrefix:  "app.traktor.mixer.channels." + (deckId+1) + "."

  AppProperty { path: pathPrefix + "is_loaded";         onValueChanged: deckLoadedTimer.start() }
  AppProperty { path: pathPrefix + "is_loaded_signal";  onValueChanged: deckLoadedTimer.start() }

  AppProperty { id: propTitle;         path: pathPrefix + "content.title" }
  AppProperty { id: propArtist;        path: pathPrefix + "content.artist" }
  AppProperty { id: propLabel;        path: pathPrefix + "content.label" }
  AppProperty { id: propRemixer;        path: pathPrefix + "content.remixer" }
  AppProperty { id: propElapsedTime;   path: pathPrefix + "track.player.elapsed_time" }
  AppProperty { id: propVolume;             path: deckpathPrefix + "volume";                }
  AppProperty { id: propXfaderAssignLeft;   path: deckpathPrefix + "xfader_assign.left";    }
  AppProperty { id: propXfaderAssignRight;  path: deckpathPrefix + "xfader_assign.right";   }
  AppProperty { id: propXfaderAdjust;       path: "app.traktor.mixer.xfader.adjust";    }

  AppProperty {
    id: propIsPlaying
    path: pathPrefix + "play"

    onValueChanged: {
      ApiClient.send("deckLoaded/", {
        elapsedTime: propElapsedTime.value,
        deck: deckLetter,
        isPlaying: propIsPlaying.value,
        title:        propTitle.value,
        artist:       propArtist.value,
        label:        propLabel.value,
        remixer:       propRemixer.value,
        date: new Date()
      })
    }
  }

 
  Timer {
    interval: 5000
    repeat: true
    running: propIsPlaying.value

    onTriggered: {
      ApiClient.send("updateDeck/", {
        deck: deckLetter,
        elapsedTime: propElapsedTime.value,
        propVolume: propVolume.value,
        propXfaderAssignLeft: propXfaderAssignLeft.value,
        propXfaderAssignRight: propXfaderAssignRight.value,
        propXfaderAdjust: propXfaderAdjust.value
      })
    }
  }

}