
/**
 *
 */
package com.newtonjoshua;

import java.io.IOException;

import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

/**
 * @author Newton Joshua
 *
 */
public class SteamFeeds {
	public static JSONObject getFeeds() throws IOException, JSONException {
		JSONObject result = new JSONObject();
		String key = "438B043ED86E8097ECCA8B2D381FA2F7";
		String steamId = "76561198260677009";

		// Get Player Details
		JSONObject player = HttpGet.get(
				"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=" + steamId);

		player = player.getJSONObject("response");

		JSONArray players = player.getJSONArray("players");

		player = players.getJSONObject(0);

		// Set response.players[{'player details'}] in result.player
		result.put("player", player);

		JSONArray gameFeeds = new JSONArray();

		// Get all the Owned Games
		JSONObject feeds = HttpGet.get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + key
				+ "&steamid=" + steamId + "&include_appinfo=1&format=json&include_played_free_games=1");
		JSONObject response = feeds.getJSONObject("response");
		JSONArray games = response.getJSONArray("games");

		// Loop through response.games[]
		for (int i = 0; i < games.length(); i++) {
			JSONObject game = games.getJSONObject(i);
			JSONObject gameData = new JSONObject();

			// Copy the data in 'game' to 'gameData' and use 'game' for iteration
			gameData = game;

			String appid = game.getString("appid");

			// Get UserStats (Achievements and Statistics) For game
			JSONObject userStats = HttpGet
					.get("http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?key=" + key
							+ "&steamid=" + steamId + "&appid=" + appid);

			// Get Schema For game to get more details about the achievements and statistics
			// of the user
			JSONObject gameSchema = HttpGet
					.get("http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=" + key + "&steamid="
							+ steamId + "&appid=" + appid);

			gameData = getGameData(userStats, gameSchema, gameData);
			gameFeeds.put(gameData);
		}

		// set gameFeeds[] to result.games
		result.put("games", gameFeeds);

		return result;

	}

	public static JSONObject getGameData(JSONObject userStats, JSONObject gameSchema, JSONObject gameData)
			throws JSONException {

		// Set the playerStats and gameSchema
		if (userStats.has("playerstats")) {
			userStats = userStats.getJSONObject("playerstats");

			if (gameSchema.has("game")) {
				gameSchema = gameSchema.getJSONObject("game");

				if (gameSchema.has("availableGameStats")) {
					JSONObject availableGameStats = gameSchema.getJSONObject("availableGameStats");

					// Achievements
					if (userStats.has("achievements") && availableGameStats.has("achievements")) {
						JSONArray achievements = userStats.getJSONArray("achievements");
						JSONArray resAchievements = new JSONArray();
						JSONArray reference = availableGameStats.getJSONArray("achievements");

						// Iterate though achievements from playerstats.achievements[] obtained from
						// GetUserStatsForGame
						for (int j = 0; j < achievements.length(); j++) {
							JSONObject achievement = achievements.getJSONObject(j);
							String name = achievement.getString("name");

							// Iterate through reference game.availableGameStats.achievements[] obtained
							// from GetSchemaForGame
							for (int k = 0; k < reference.length(); k++) {
								JSONObject ref = reference.getJSONObject(k);
								String refName = ref.getString("name");

								if (name.equals(refName)) {

									// put all the data from Schema for all the Achievements of the user in
									// resAchievements
									resAchievements.put(ref);

									break;
								}
							}
						}

						// put resAchievements in gameData.achievements
						gameData.put("achievements", resAchievements);
					}

					// Stats
					if (userStats.has("stats") && availableGameStats.has("stats")) {
						JSONArray stats = userStats.getJSONArray("stats");
						JSONArray resStats = new JSONArray();
						JSONArray reference = availableGameStats.getJSONArray("stats");

						// Iterate though stats from playerstats.stats[] obtained from
						// GetUserStatsForGame
						for (int j = 0; j < stats.length(); j++) {
							JSONObject stat = stats.getJSONObject(j);
							String name = stat.getString("name");
							int value = stat.getInt("value");

							// Iterate through reference game.availableGameStats.stats[] obtained from
							// GetSchemaForGame
							for (int k = 0; k < reference.length(); k++) {
								JSONObject ref = reference.getJSONObject(k);
								String refName = ref.getString("name");

								if (name.equals(refName)) {

									// put all the data from Schema for all the stats of the user in resStats
									ref.put("value", value);
									resStats.put(ref);

									break;
								}
							}
						}

						// put resStats in gameData.stats
						gameData.put("stats", resStats);
					}
				}
			}
		}

		return gameData;
	}

}

// ~ Formatted by Jindent --- http://www.jindent.com
