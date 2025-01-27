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
        CAST(ep.week_high_low_max AS NUMERIC) AS week_high_low_max_numeric,
        CAST(ep.lower_cp AS NUMERIC) AS lower_cp_numeric,
        CAST(ep.upper_cp AS NUMERIC) AS upper_cp_numeric,
        (ep.last_price - CAST(ep.week_high_low_max AS NUMERIC)) / CAST(ep.week_high_low_max AS NUMERIC) * 100 AS fall_from_week_high,
        (ep.last_price - CAST(ep.lower_cp AS NUMERIC)) / CAST(ep.lower_cp AS NUMERIC) * 100 AS fall_from_lower_cp,
        (ep.last_price - CAST(ep.upper_cp AS NUMERIC)) / CAST(ep.upper_cp AS NUMERIC) * 100 AS fall_from_upper_cp,
        ti.trade_info_total_market_cap AS market_cap,
        sdp.delivery_to_traded_quantity,
        fr.pro_loss_aft_tax AS latest_profit_loss
    FROM 
        equity_info ei
    LEFT JOIN equity_price_info ep ON ei.symbol = ep.symbol
    LEFT JOIN trade_info ti ON ei.symbol = ti.symbol
    LEFT JOIN security_wise_dp sdp ON ei.symbol = sdp.symbol
    LEFT JOIN financial_results fr ON ei.symbol = fr.symbol
    WHERE 
        ti.trade_info_total_market_cap > 500 AND ti.trade_info_total_market_cap < 500000 
        AND sdp.delivery_to_traded_quantity > 55 AND fr.pro_loss_aft_tax > 1000
    ORDER BY 
        LEAST(
            (ep.last_price - CAST(ep.week_high_low_max AS NUMERIC)) / CAST(ep.week_high_low_max AS NUMERIC),
            (ep.last_price - CAST(ep.lower_cp AS NUMERIC)) / CAST(ep.lower_cp AS NUMERIC),
            (ep.last_price - CAST(ep.upper_cp AS NUMERIC)) / CAST(ep.upper_cp AS NUMERIC)
        ) ASC; -- Sort by maximum fall (most negative value first)
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    return column_names, rows

# Function to analyze mean reversion potential
def analyze_mean_reversion(df):
    """Analyze stocks for mean reversion potential."""
    mean_reversion = []
    
    for _, row in df.iterrows():
        strategies = []
        
        # Handle None values
        fall_from_week_high = row["fall_from_week_high"] if row["fall_from_week_high"] is not None else None
        fall_from_lower_cp = row["fall_from_lower_cp"] if row["fall_from_lower_cp"] is not None else None
        fall_from_upper_cp = row["fall_from_upper_cp"] if row["fall_from_upper_cp"] is not None else None

        # Determine mean reversion potential
        if fall_from_week_high is not None and fall_from_week_high < -20:
            strategies.append("Potential Mean Reversion from Week High")
        if fall_from_lower_cp is not None and fall_from_lower_cp < -20:
            strategies.append("Oversold (Mean Reversion from Lower CP)")
        if fall_from_upper_cp is not None and fall_from_upper_cp < -10:
            strategies.append("Potential Mean Reversion from Upper CP")

        mean_reversion.append(", ".join(strategies) if strategies else "No specific potential")
    
    df["Mean Reversion Potential"] = mean_reversion
    return df

# Streamlit UI
def main():
    st.title("📊 Stock Data Viewer with Mean Reversion Analysis")
    st.markdown("View stock data and analyze potential for mean reversion trading strategies.")

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()

        # Fetch filtered stock data
        column_names, rows = get_filtered_stocks(cursor)

        if rows:
            # Convert to DataFrame for better display
            df = pd.DataFrame(rows, columns=column_names)
            
            # Analyze mean reversion
            df = analyze_mean_reversion(df)

            # Display the DataFrame
            st.dataframe(df)

            # Option to download the data as a CSV
            csv = df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="Download Data with Mean Reversion Analysis as CSV",
                data=csv,
                file_name="stocks_with_mean_reversion.csv",
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
