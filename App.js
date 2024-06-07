import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, Linking } from 'react-native';
import axios from 'axios';
import xml2js from 'react-native-xml2js';

const NewsFeed = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('https://www.inegi.org.mx/rss/noticias/xmlfeeds?p=4,29');
                const parser = new xml2js.Parser();
                parser.parseString(response.data, (error, result) => {
                    if (error) {
                        console.error('Error parsing XML:', error);
                        return;
                    }
                    const items = result.rss.channel[0].row;
                    // console.log(items[0]);
                    /*const newsItems = items.map((item) => ({
                        title: item.title[0],
                        description: item.description[0],
                        link: item.link[0],
                        pubDate: item.pubDate[0],
                    }));
                    setNews(newsItems);*/
                    items.forEach((item) => {
                        console.log(item.title);
                        const newsItem = {
                            title: item.title,
                            description: item.description,
                            link: item.link,
                            pubDate: item.pubDate,
                        };
                        news.push(newsItem);
                    });
                    setNews(news);
                });
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

    const openLink = (link) => {
        Linking.openURL(link).catch((err) => {
            console.error("Failed to open link:", err);
        });
    };
    const renderNewsItem = ({ item }) => (
        <View style={styles.newsItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {/* <Text style={styles.pubDate}>{new Date(item.pubDate).toLocaleDateString()}</Text> */}
            <Text style={styles.link} onPress={() => openLink(item.link[0])}>Leer más</Text>
        </View>
    );

    return (
        <View style={styles.flat}>
            <Text style={[styles.heading, { color: 'purple' }]}>Noticias Destacadas</Text>
            <FlatList
                style={styles.container}
                data={news}
                renderItem={renderNewsItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flat: {
        paddingTop: 50,
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
    },
    heading: {
        textAlign: 'center',
        //paddingLeft: 40,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    newsItem: {
        backgroundColor: '#fff',
        marginBottom: 30,
        padding: 30,
        borderRadius: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderWidth: 1, // Borde negro alrededor
        borderColor: '#000', // Color del borde negro
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 12,
        marginBottom: 5,
    },
    pubDate: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    link: {
        color: 'purple',
        textDecorationLine: 'underline',
    },
});

export default NewsFeed;

