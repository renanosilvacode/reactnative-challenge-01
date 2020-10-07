import React, { useEffect, useState} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {

  const[repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response =>{
      setRepositories(response.data);
    });
  },[]);

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality
    const urlToPost = `repositories/${id}/like`;
    /*
      ////This was my first response. 
      ////It passed on the test, however did not respected the concept of immutability
      ////Also, it kept changing the index of the updated object :-/

      await api.post(urlToPost).then(response => {
      const repositoryUpdatedIndex = repositories.findIndex(repository => repository.id === id);
      repositories.splice(repositoryUpdatedIndex, 1);
      setRepositories([... repositories, response.data]);
    });*/

    //Here a more elegant solution using map to update the object on the fly.
    const response = await api.post(urlToPost);
    const likedRepository = response.data;

    const repositoriesUpdated = repositories.map(repository => {
      return repository.id === id ? likedRepository : repository;
    })

    setRepositories(repositoriesUpdated);

  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
            data={repositories}
            keyExtractor={repository => repository.id}
            renderItem={({item: repository}) => (
              <View style={styles.repositoryContainer} key={repository.id}>
                <Text style={styles.repository}>{repository.title}</Text>

                <View style={styles.techsContainer}>
                  
                  {repository.techs.map(tech => {
                    return(
                      <Text style={styles.tech} key={tech}>
                        {tech}
                      </Text>
                    )
                  })}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {repository.likes} curtidas
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
