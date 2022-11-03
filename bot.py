
"""
Simple example of a Telegram WebApp which displays a photo filter.
The static website for this website is hosted on the vercel.
"""
import base64
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
from telegram import KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update, WebAppInfo
from telegram import __version__ as TG_VER
import json
import logging
import os
import redis

r = redis.from_url(
    'redis-uri')


try:
    from telegram import __version_info__
except ImportError:
    __version_info__ = (0, 0, 0, 0, 0)  # type: ignore[assignment]

if __version_info__ < (20, 0, 0, "alpha", 1):
    raise RuntimeError(
        f"This example is not compatible with your current PTB version {TG_VER}. To view the "
        f"{TG_VER} version of this example, "
        f"visit https://docs.python-telegram-bot.org/en/v{TG_VER}/examples.html"
    )

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)


# Define a `/start` command handler.
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message with a button that opens a the web app."""
    await update.message.reply_text(
        "Please press the button below to choose a color via the WebApp.",
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text="Open the app",
                web_app=WebAppInfo(url="https://web-app-host"),
            )
        ),
    )


# Handle incoming WebAppData
async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Print the received data and remove the button."""
    # Here we use `json.loads`, since the WebApp sends the data JSON serialized string
    # (see webappbot.html)

    data = json.loads(update.effective_message.web_app_data.data)
    print(data.keys())
    decoded_data=base64.b64decode((r.get(data['key']).decode('utf-8').replace('data:image/png;base64,','')))
    #write the decoded data back to original format in  file
    img_file = open('out.png', 'wb')
    img_file.write(decoded_data)
    img_file.close()

    await update.message.reply_photo(open('out.png', "rb"))


def main() -> None:
    """Start the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token(
        "BotToken").build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(
        filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    # Run the bot until the user presses Ctrl-C+
    application.run_polling()
    application.run_webhook(listen="0.0.0.0",
                      port=int(os.environ.get('PORT', 5000)),
                      url_path="BotToken",
                      webhook_url= "https://web-app-host/" + "BotToken"
                      )


if __name__ == "__main__":
    main()
