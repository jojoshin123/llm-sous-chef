# LLM Sous Chef
My friends and I find most of our home cooking recipes on short-form video social media (Instagram Reels, TikTok) but we were struggling to find an easy (and free) way to organize them into a centralized knowledge base.

[**LLM Sous Chef**](https://llmsouschef.jonzh.org/) will take in a URL to a cooking social media video post (or any recipe URL!) and convert it to a coherent recipe, which you can easily save to a collection of cookbooks under your account.


![image](https://github.com/jojoshin123/llm-sous-chef/blob/develop/recording.gif)


All it does is aggregate the video data -- the transcript, title, description, and any recipe URLs in the description -- and send it off for LLM inference via Groqcloud to output a recipe.
You can also input a normal URL to any website with a recipe, which can be helpful if the video data is not sufficient (this frequently happens).
