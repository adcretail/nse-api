import psycopg2
from psycopg2 import sql
import streamlit as st
import pandas as pd

# Database connection parameters
db_params = {
    'dbname': 'stock_analytics',
    'user': 'root',
    'password': 'arka1256',
    'host': 'localhost',
    'port': '5432'
}

# SQL query to fetch filtered stock data
def get_filtered_stocks(cursor):
    """Retrieve filtered stock data with computed metrics."""
    query = """
    SELECT 
        ei.company_name,
        ei.symbol,
        ep.last_price AS last_traded_price,
        CAST(ep.upper_cp AS NUMERIC) AS upper_cp_numeric,
        CAST(ep.week_high_low_max AS NUMERIC) AS week_high_low_max_numeric,
        (ep.last_price - CAST(ep.upper_cp AS NUMERIC)) / CAST(ep.upper_cp AS NUMERIC) * 100 AS drop_from_upper_cp,
        (ep.last_price - CAST(ep.week_high_low_max AS NUMERIC)) / CAST(ep.week_high_low_max AS NUMERIC) * 100 AS drop_from_week_high,
        ti.trade_info_total_market_cap AS market_cap,
        em.pd_symbol_pe AS symbol_pe,
        sdp.delivery_to_traded_quantity,
        sp.promoter_and_promoter_group AS shareholding_pattern,
        fr.income AS latest_income,
        fr.expenditure AS latest_expenditure,
        fr.pro_loss_aft_tax AS latest_profit_loss
    FROM 
        equity_info ei
    LEFT JOIN equity_price_info ep ON ei.symbol = ep.symbol
    LEFT JOIN equity_metadata em ON ei.symbol = em.symbol
    LEFT JOIN security_wise_dp sdp ON ei.symbol = sdp.symbol
    LEFT JOIN trade_info ti ON ei.symbol = ti.symbol
    LEFT JOIN shareholdings_patterns sp ON ei.symbol = sp.symbol
    LEFT JOIN financial_results fr ON ei.symbol = fr.symbol
     WHERE 
        ti.trade_info_total_market_cap > 1000 AND ti.trade_info_total_market_cap < 10000 AND sdp.delivery_to_traded_quantity > 65 AND fr.pro_loss_aft_tax>1000
    ORDER BY 
        sdp.delivery_to_traded_quantity DESC;
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    return column_names, rows

# Function to suggest trading strategies
def suggest_trading_strategies(df):
    """Analyze stock data and suggest trading strategies."""
    suggestions = []
    
    for _, row in df.iterrows():
        strategies = []
        
        # Handle None values
        last_price = float(row["last_traded_price"]) if row["last_traded_price"] is not None else None
        upper_cp = float(row["upper_cp_numeric"]) if row["upper_cp_numeric"] is not None else None
        week_high = float(row["week_high_low_max_numeric"]) if row["week_high_low_max_numeric"] is not None else None
        drop_from_week_high = row["drop_from_week_high"] if row["drop_from_week_high"] is not None else None
        delivery_to_traded_quantity = row["delivery_to_traded_quantity"] if row["delivery_to_traded_quantity"] is not None else None
        symbol_pe = row["symbol_pe"] if row["symbol_pe"] is not None else None
        market_cap = row["market_cap"] if row["market_cap"] is not None else None

        # Suggested strategies
        if drop_from_week_high is not None and drop_from_week_high > 20:
            strategies.append("Mean Reversion")
        if delivery_to_traded_quantity is not None and delivery_to_traded_quantity > 70:
            strategies.append("Momentum")
        if symbol_pe is not None and symbol_pe < 15 and market_cap is not None and market_cap < 1_000_000_000:
            strategies.append("Value Investing")
        if last_price is not None and upper_cp is not None and last_price >= upper_cp * 0.95:
            strategies.append("Breakout Trading")
        
        suggestions.append(", ".join(strategies) if strategies else "No specific strategy")
    
    df["Suggested Strategies"] = suggestions
    return df

# Streamlit UI
def main():
    st.title("📊 Filtered Stock Data Viewer with Trading Strategies")
    st.markdown("View filtered stock data and suggested quant-based trading strategies.")

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()

        # Fetch filtered stock data
        column_names, rows = get_filtered_stocks(cursor)

        if rows:
            # Convert to DataFrame for better display
            df = pd.DataFrame(rows, columns=column_names)
            
            # Suggest trading strategies
            df = suggest_trading_strategies(df)

            # Display the DataFrame
            st.dataframe(df)

            # Option to download the data as a CSV
            csv = df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="Download Data with Strategies as CSV",
                data=csv,
                file_name="filtered_stocks_with_strategies.csv",
                mime="text/csv"
            )
        else:
            st.warning("No data found matching the criteria.")

    except Exception as error:
        st.error(f"Error: {error}")

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
